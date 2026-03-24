import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  useDeleteSourceMutation,
  useGetAllSectionsQuery,
  useGetAllSourcesQuery,
} from "@/app/api";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { IoMdTrash } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { AddFromWhere, AddSection } from "../modals";
import { SectionCard } from "../section-card";
import { useHandleRequest } from "@/hooks";
import { Alert, Loader } from "@/components";
import { useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const Card = () => {
  const { branch } = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );

  const { data: { sources } = {}, isLoading: isGettingSources } =
    useGetAllSourcesQuery("");
  const [deleteSource, { isLoading: isDeleting }] = useDeleteSourceMutation();
  const { data: { sections } = {}, isLoading: isGettingSections } =
    useGetAllSectionsQuery({ branch });

  const [fromWhereMenu, setFromWhereMenu] = useState<HTMLElement | null>(null);
  const [openModals, setOpenModals] = useState<"fromWhere" | "section" | null>(
    null
  );

  const [selectedFromWhere, setSelectedFromWhere] = useState<boolean>(false);
  const [selectedFromWhereId, setSelectedFromWhereId] = useState<string>("");
  const handleRequest = useHandleRequest();

  const handleClickMenu = (
    event: React.MouseEvent<HTMLElement>,
    id: string
  ) => {
    setFromWhereMenu(event.currentTarget);
    setSelectedFromWhere(false);
    setSelectedFromWhereId(id);
  };

  const handleClose = () => {
    setFromWhereMenu(null);
  };

  const handleModalClose = () => {
    setOpenModals(null);
    setSelectedFromWhere(false);
    setTimeout(() => {
      setSelectedFromWhereId("");
    }, 500);
  };

  const { t } = useTranslation("", { keyPrefix: "leads.card" });

  const onDelete = async (id: string) => {
    await handleRequest({
      request: async () => {
        const result = await deleteSource({ id }).unwrap();
        return result;
      },
      onSuccess: () => {
        setSelectedFromWhere(false);
        toast.success(`${t("toast")}`);
      },
    });
  };

  if (isGettingSources || isGettingSections) {
    return <Loader sx={{ height: "50vh", backgroundColor: "transparent" }} />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: {
            xs: "6px",
            sm: "10px",
            md: "20px",
            lg: "30px",
          },
          maxWidth: {
            xs: "96vw",
            sm: "94vw",
            md: "80vw",
            lg: "80vw",
            xl: "84vw",
          },
          overflowX: "auto",
          marginLeft: {
            xs: "2px",
            sm: "-40px",
          },
          marginRight: {
            xs: "-36px",
            sm: "-36px",
          },
          paddingLeft: {
            xs: "0px",
            sm: "40px",
            md: "40px",
          },
          paddingRight: {
            xs: "0px",
            sm: "0px",
            md: "0px",
            lg: "35px",
          },
          paddingBottom: "6px",
        }}
      >
        <Box
          sx={{
            minHeight: "63vh",
            backgroundColor: "white",
            padding: {
              xs: "6px",
              sm: "10px",
              md: "17px",
            },
            borderRadius: "6px",
            border: "1px solid #ccc",
            minWidth: {
              xs: "160px",
              sm: "200px",
              md: "220px",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "16px",
                sm: "20px",
                md: "22px",
              },
              fontWeight: "bold",
              color: "primary.main",
              mb: {
                xs: 0.5,
                sm: 1,
                md: 2,
              },
              textAlign: "center",
            }}
          >
            {t("from_where")}
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              py: {
                xs: 0.5,
                sm: 1,
              },
              borderRadius: "6px",
            }}
            onClick={() => setOpenModals("fromWhere")}
          >
            <GoPlus size={25} />
          </Button>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              mt: {
                xs: 0.5,
                sm: 1,
                md: 2,
              },
            }}
          >
            {sources && sources.length ? (
              sources.map((source) => (
                <Box
                  key={source._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    borderColor: "primary.main",
                    padding: {
                      xs: "2px 4px",
                      sm: "4px 8px",
                      md: "5px 12px",
                    },
                  }}
                >
                  <Box
                    sx={{
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={500}
                      sx={{
                        fontSize: {
                          xs: "10px",
                          sm: "12px",
                        },
                      }}
                    >
                      {source.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="primary.main"
                      sx={{
                        fontSize: {
                          xs: "16px",
                          sm: "18px",
                          md: "20px",
                        },
                      }}
                    >
                      {source.leads}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={(e) => handleClickMenu(e, source._id)}
                    sx={{
                      ml: {
                        xs: 0,
                        sm: 1,
                        md: 2,
                      },
                    }}
                    size="small"
                    aria-haspopup="true"
                    aria-controls={fromWhereMenu ? "fromWhere" : undefined}
                    aria-expanded={fromWhereMenu ? "true" : undefined}
                  >
                    <BsThreeDotsVertical className="cursor-pointer" />
                  </IconButton>
                </Box>
              ))
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: "primary.main",
                  textAlign: "center",
                  mt: {
                    xs: 0.5,
                    sm: 1,
                    md: 2,
                  },
                }}
              >
                {t("no_data_available")}
              </Typography>
            )}
          </Box>
        </Box>
        {sections && sections.length
          ? sections.map((section) => (
              <SectionCard key={section._id} section={section} />
            ))
          : null}
        <Button
          variant="outlined"
          sx={{
            minWidth: {
              xs: "120px",
              sm: "140px",
              md: "160px",
            },
            py: {
              xs: 0.5,
              sm: 1,
            },
            backgroundColor: "white",
            borderRadius: "6px",
          }}
          onClick={() => setOpenModals("section")}
        >
          <GoPlus size={22} />
        </Button>
      </Box>

      <Menu
        id="fromWhere"
        anchorEl={fromWhereMenu}
        open={Boolean(fromWhereMenu)}
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
            setOpenModals("fromWhere");
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
            color: "red",
          }}
          onClick={() => {
            setSelectedFromWhere(true);
            setSelectedFromWhereId(selectedFromWhereId);
            handleClose();
          }}
        >
          <span>
            <IoMdTrash size={18} />
          </span>
          {t("delete")}
        </MenuItem>
      </Menu>

      <AddFromWhere
        id={selectedFromWhereId}
        open={openModals === "fromWhere"}
        onClose={handleModalClose}
      />
      <AddSection
        open={openModals === "section"}
        onClose={() => setOpenModals(null)}
      />
      <Alert
        title={t("delete_form_where_source")}
        text={t("alert_text_are")}
        open={selectedFromWhere}
        onClose={() => setSelectedFromWhere(false)}
        onClick={() => onDelete(selectedFromWhereId)}
        isLoading={isDeleting}
      />
    </DndProvider>
  );
};
