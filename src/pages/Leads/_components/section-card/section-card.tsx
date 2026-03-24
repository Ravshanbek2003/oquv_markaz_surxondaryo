import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  useDeleteSectionMutation,
  useGetAllLeadsQuery,
  useUpdateLeadMutation,
} from "@/app/api";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { IoMdTrash } from "react-icons/io";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { Props } from "./types";

import { useSelector } from "react-redux";
import { Status } from "@/constants";
import { Alert, Loader } from "@/components";
import { AddSection as EditSection } from "../modals";
import { useHandleRequest } from "@/hooks";
import { AddModal as CreateGroup } from "@/pages/Groups/_components/add-modal";
import { motion } from "framer-motion";
import { LeadCard } from "./lead-card";
import { useDrop } from "react-dnd";
import { Lead } from "@/app/api/leadsApi/types";
import { useDispatch } from "react-redux";
import { setLead } from "@/app/slices";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const SectionCard = ({ section }: Props) => {
  const { branch } = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );

  const { data: { leads } = {}, isLoading: isGettingLeads } =
    useGetAllLeadsQuery({
      branch,
      section: section._id,
      status: Status.ACTIVE,
    });
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [createGroup, setCreateGroup] = useState<HTMLElement | null>(null);
  const [isFold, setIsFold] = useState(false);
  const [leadsArray, setLeadsArray] = useState<Lead[]>([]);
  const [openEditModals, setOpenEditModals] = useState<
    "section" | "createGroup" | null
  >(null);
  const [openAlerts, setOpenAlerts] = useState<"section" | null>(null);

  const [deleteSection, { isLoading: isDeletingSection }] =
    useDeleteSectionMutation();
  const [updateLead] = useUpdateLeadMutation();
  const handleRequest = useHandleRequest();
  const dispatch = useDispatch();

  const { t } = useTranslation("", { keyPrefix: "leads.card.section_card" });

  const handleClose = () => {
    setCreateGroup(null);
  };

  const handleModalClose = () => {
    setOpenEditModals(null);
  };

  const handleCloseAlert = () => {
    setOpenAlerts(null);
  };

  const onUpdateLeadSection = async (lead: Lead, sectionId: string) => {
    await handleRequest({
      request: async () => {
        const result = await updateLead({
          id: lead._id,
          body: { section: sectionId },
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        toast.success(`${t("toast")}`);
      },
    });
  };

  const [, drop] = useDrop({
    accept: "lead",
    drop: (item: { lead: Lead; sectionId: string }) => {
      if (item?.lead?.section?._id !== section._id) {
        dispatch(setLead({ ...item.lead, section }));
        setLeadsArray([...leadsArray, { ...item.lead, section }]);
        onUpdateLeadSection(item.lead, section._id).catch((err) =>
          toast.error(err)
        );
      }
    },
  });

  const onDelete = async (id: string) => {
    await handleRequest({
      request: async () => {
        const result = await deleteSection({ id }).unwrap();
        return result;
      },
      onSuccess: () => {
        handleCloseAlert();
        toast.success(`${t("toast1")}`);
      },
    });
  };

  useEffect(() => {
    if (Array.isArray(leads)) {
      setLeadsArray(leads);
    }
  }, [leads]);

  useEffect(() => {
    dispatch(setLead(undefined));
  }, [dispatch]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isFold ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-5"
          >
            <Box
              sx={{
                borderRadius: "6px",
                border: "1px solid #ccc",
                backgroundColor: "white",
                minHeight: "63vh",
                maxWidth: "60px",
                padding: "17px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => setIsFold(false)}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  rotate: "90deg",
                  position: "relative",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "17px",
                    width: "max-content",
                    position: "absolute",
                    left: "30px",
                  }}
                >
                  {section.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "primary.main",
                    borderRadius: "50%",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                  }}
                >
                  {leadsArray.length}
                </Typography>
              </Box>
              <IconButton
                size="small"
                aria-haspopup="true"
                onClick={() => setIsFold(false)}
                sx={{ rotate: "180deg" }}
              >
                <IoChevronBackOutline size={23} />
              </IconButton>
            </Box>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start gap-5"
          >
            <div
              ref={drop}
              style={{
                minWidth: matches ? "320px" : "200px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                backgroundColor: "white",
                height: "63vh",
                padding: matches ? "20px 17px" : "10px 6px",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "12px",
                        sm: "16px",
                      },
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      width: "24px",
                      height: "24px",
                      backgroundColor: "primary.main",
                      borderRadius: "50%",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {leadsArray.length}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <IconButton
                    size="small"
                    aria-haspopup="true"
                    onClick={() => setIsFold(true)}
                  >
                    <IoChevronBackOutline size={23} />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-haspopup="true"
                    onClick={(e) => setCreateGroup(e.currentTarget)}
                    aria-controls={createGroup ? "createGroup" : undefined}
                    aria-expanded={createGroup ? "true" : undefined}
                  >
                    <BsThreeDotsVertical size={20} />
                  </IconButton>
                </Box>
              </Box>
              <div
                style={{
                  marginTop: matches ? "20px" : "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: matches ? "10px" : "5px",
                  height: "345px",
                  backgroundColor: "transparent",
                  overflowY: "auto",
                  paddingRight: leadsArray?.length > 4 ? 1 : 0,
                }}
              >
                {isGettingLeads ? (
                  <Loader
                    sx={{ height: "40vh", backgroundColor: "transparent" }}
                  />
                ) : leadsArray.length ? (
                  leadsArray.map((lead) => (
                    <LeadCard key={lead._id} lead={lead} matches={matches} />
                  ))
                ) : (
                  <Typography
                    sx={{
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "40vh",
                      color: "primary.main",
                    }}
                  >
                    {t("no_leads_available")}
                  </Typography>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Menu
        id="createGroup"
        anchorEl={createGroup}
        open={Boolean(createGroup)}
        onClose={handleClose}
        sx={{ borderRadius: "6px" }}
      >
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "orange",
          }}
          onClick={() => {
            setOpenEditModals("section");
            setCreateGroup(null);
          }}
        >
          <span>
            <MdModeEdit size={18} />
          </span>
          {t("menu.edit")}
        </MenuItem>
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "red",
          }}
          onClick={() => {
            setOpenAlerts("section");
            handleClose();
          }}
        >
          <span>
            <IoMdTrash size={18} />
          </span>
          {t("menu.delete")}
        </MenuItem>
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
          onClick={() => {
            setOpenEditModals("createGroup");
            handleClose();
          }}
        >
          <span>
            <GoPlus size={18} />
          </span>
          {t("menu.create_group")}
        </MenuItem>
      </Menu>

      <EditSection
        id={section._id}
        open={openEditModals === "section"}
        onClose={handleModalClose}
      />

      <CreateGroup
        open={openEditModals === "createGroup"}
        onClose={handleModalClose}
        sectionId={section._id}
        isLeadSection
      />

      <Alert
        title={t("alert.title")}
        text={t("alert.text")}
        onClick={() => onDelete(section._id)}
        onClose={handleCloseAlert}
        open={openAlerts === "section"}
        isLoading={isDeletingSection}
      />
    </div>
  );
};
