import { Lead } from "@/app/api/leadsApi/types";
import { Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { BsInfoCircle, BsThreeDotsVertical } from "react-icons/bs";
import { AddLead as EditLead } from "../../modals";
import { AddGroup } from "@/pages/Student/_components";
import { Alert } from "@/components";
import { useUpdateLeadMutation } from "@/app/api";
import { useHandleRequest } from "@/hooks";
import { useState } from "react";
import { Status } from "@/constants";
import toast from "react-hot-toast";
import { MdModeEdit } from "react-icons/md";
import { LuMessageCircle } from "react-icons/lu";
import { IoArchive } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { useDrag } from "react-dnd";
import { useSelector } from "react-redux";
import { formatUzbekPhoneNumber } from "@/utils";
import { useTranslation } from "react-i18next";

export const LeadCard = ({
  lead,
  matches,
}: {
  lead: Lead;
  matches: boolean;
}) => {
  const { t } = useTranslation("", {
    keyPrefix: "leads.card.section_card.lead_card",
  });
  const { draggingLead } = useSelector(
    (state: { leads: { draggingLead: Lead } }) => state.leads
  );
  const [archiveLead, { isLoading: isArchivingLead }] = useUpdateLeadMutation();
  const handleRequest = useHandleRequest();

  const [addToGroup, setAddToGroup] = useState<HTMLElement | null>(null);
  const [info, setInfo] = useState<HTMLElement | null>(null);
  const [infoData, setInfoData] = useState<Lead | null>(null);
  const [leadId, setLeadId] = useState<string>("");
  const [openEditModals, setOpenEditModals] = useState<
    "section" | "lead" | "addToGroup" | "createGroup" | null
  >(null);
  const [openAlerts, setOpenAlerts] = useState<"section" | "lead" | null>(null);

  const handleLeadMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    id: string
  ) => {
    setAddToGroup(event.currentTarget);
    setLeadId(id);
  };

  const handleClose = () => {
    setAddToGroup(null);
    setInfo(null);
    setTimeout(() => {
      setInfoData(null);
    }, 500);
  };

  const handleCloseAlert = () => {
    setOpenAlerts(null);
  };

  const handleModalClose = () => {
    setOpenEditModals(null);
  };

  const [{ isDragging }, drag] = useDrag({
    type: "lead",
    item: { lead, sectionId: lead?.section?._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const onArchive = async (id: string) => {
    await handleRequest({
      request: async () => {
        const result = await archiveLead({
          id,
          body: { status: Status.INACTIVE },
        }).unwrap();
        return result;
      },
      onSuccess: () => {
        handleCloseAlert();
        toast.success(t("toast"));
      },
    });
  };

  return (
    <>
      {(draggingLead?._id === lead?._id &&
        draggingLead?.section?._id !== lead?.section?._id) ||
      isDragging ? null : (
        <div
          ref={drag}
          key={lead._id}
          style={{
            backgroundColor: "#ebecf2",
            border: "1px solid #ccc",
            padding: matches ? "10px" : "4px",
            borderRadius: "6px",
            display: "flex",
            justifyContent: "space-between",
            opacity: 1,
          }}
        >
          <div className="flex items-center gap-2">
            <Avatar
              src=""
              sx={{
                bgcolor: "primary.main",
                height: {
                  xs: "30px",
                  sm: "40px",
                },
                width: {
                  xs: "30px",
                  sm: "40px",
                },
                fontSize: {
                  xs: "14px",
                  sm: "20px",
                },
              }}
            >
              {lead.fullName.charAt(0)}
            </Avatar>
            <div className="flex flex-col items-start">
              <Typography
                sx={{
                  fontSize: {
                    xs: "10px",
                    sm: "14px",
                  },
                }}
              >
                {lead.fullName}
              </Typography>
              <Typography
                sx={{
                  fontSize: {
                    xs: "8px",
                    sm: "12px",
                  },
                }}
              >
                {formatUzbekPhoneNumber(lead.phoneNumber)}
              </Typography>
            </div>
          </div>
          <div className="flex items-center">
            <IconButton
              size="small"
              aria-haspopup="true"
              onClick={(e) => {
                setInfo(e.currentTarget as HTMLElement);
                setInfoData(lead);
              }}
              aria-controls={info ? "info" : undefined}
              aria-expanded={info ? "true" : undefined}
            >
              <BsInfoCircle size={"1.1rem"} />
            </IconButton>
            <IconButton
              size="small"
              aria-haspopup="true"
              onClick={(e) => handleLeadMenuClick(e, lead._id)}
              aria-controls={addToGroup ? "addToGroup" : undefined}
              aria-expanded={addToGroup ? "true" : undefined}
            >
              <BsThreeDotsVertical />
            </IconButton>
          </div>
        </div>
      )}

      <Menu
        id="addToGroup"
        anchorEl={addToGroup}
        open={Boolean(addToGroup)}
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
            setOpenEditModals("lead");
            handleClose();
          }}
        >
          <span>
            <MdModeEdit size={18} />
          </span>
          {t("edit")}
        </MenuItem>
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "green",
          }}
        >
          <span>
            <LuMessageCircle size={18} />
          </span>
          {t("sms")}
        </MenuItem>
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "gray",
          }}
          onClick={() => {
            setOpenAlerts("lead");
            handleClose();
          }}
        >
          <span>
            <IoArchive size={18} />
          </span>
          {t("archive")}
        </MenuItem>
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
          onClick={() => {
            setOpenEditModals("addToGroup");
            handleClose();
          }}
        >
          <span>
            <GoPlus size={18} />
          </span>
          {t("add_to_group")}
        </MenuItem>
      </Menu>

      <Menu
        id="info"
        anchorEl={info}
        open={Boolean(info)}
        onClose={handleClose}
        sx={{ borderRadius: "6px" }}
      >
        <div className="px-4 min-w-[276px]">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[13px] inline-block">{t("full_name")}:</p>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              {infoData?.fullName}
            </Typography>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-[13px] inline-block">{t("phone_number")}:</p>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              {formatUzbekPhoneNumber(infoData?.phoneNumber as string)}
            </Typography>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-[13px] inline-block">{t("updated")}:</p>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              {infoData?.updatedAt &&
                new Date(infoData?.updatedAt).toLocaleDateString()}
            </Typography>
          </div>
        </div>
      </Menu>

      <EditLead
        id={leadId}
        open={openEditModals === "lead"}
        onClose={handleModalClose}
      />

      <AddGroup
        open={openEditModals === "addToGroup"}
        onClose={handleModalClose}
        studentId={leadId}
        groups={[]}
        isLead
      />

      <Alert
        title={t("title")}
        text={t("text")}
        onClick={() => onArchive(leadId)}
        onClose={handleCloseAlert}
        open={openAlerts === "lead"}
        isLoading={isArchivingLead}
        buttonText={t("btn_text")}
      />
    </>
  );
};
