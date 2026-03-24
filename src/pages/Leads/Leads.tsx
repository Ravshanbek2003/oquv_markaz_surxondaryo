import { BoldTabs } from "@/components";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Stack,
} from "@mui/material";
import { RiListCheck } from "react-icons/ri";
import { TbLayoutCardsFilled } from "react-icons/tb";
import { AddLead, Card, List } from "./_components";
import { GrPowerReset } from "react-icons/gr";
import { IoSearchOutline } from "react-icons/io5";
import { MultipleSelect } from "@/components/MultipleSelect";
import { GoPlus } from "react-icons/go";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import { useGetAllSectionsQuery, useGetAllSourcesQuery } from "@/app/api";
import { useTranslation } from "react-i18next";

export const LeadsPage = () => {
  const { branch } = useSelector(
    (state: { branch: { branch: string } }) => state.branch
  );
  const { data: { sections } = {} } = useGetAllSectionsQuery({ branch });
  const { data: { sources } = {} } = useGetAllSourcesQuery("");
  const [addLead, setAddLead] = useState(false);
  const [filters, setFilters] = useState<{
    sections: string[];
    fromWhere: string[];
    search: string;
  }>({ sections: [], fromWhere: [], search: "" });
  const [debouncedValue] = useDebounce(filters.search.trim(), 500);
  const { t } = useTranslation("", { keyPrefix: "leads" });

  const handleFilter = (key: "sections" | "fromWhere", value: string[]) => {
    setFilters((prev) => {
      return { ...prev, [key]: value };
    });
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent={"space-between"}
        defaultValue="card-lead"
        sx={{ pb: 4 }}
      >
        <BoldTabs
          tabButtonSx={{ minWidth: "10px" }}
          tabs={[
            {
              label: <TbLayoutCardsFilled size={25} />,
              children: <Card />,
              value: "card-lead",
              leftSideContent: (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: {
                      xs: "center",
                      sm: "flex-end",
                    },
                  }}
                >
                  <Button
                    startIcon={<GoPlus />}
                    variant="contained"
                    color="primary"
                    sx={{
                      boxShadow: "none",
                      textTransform: "none",
                      whiteSpace: "nowrap",
                      width: {
                        xs: "100%",
                        sm: "auto",
                      },
                      padding: {
                        xs: "4px 24px",
                        sm: "10px 24px",
                        md: "11px 24px",
                      },
                    }}
                    onClick={() => setAddLead(true)}
                  >
                    {t("add_new_lead")}
                  </Button>
                </Box>
              ),
            },
            {
              label: <RiListCheck size={25} />,
              children: (
                <List debouncedValue={debouncedValue} filters={filters} />
              ),
              value: "list-lead",
              leftSideContent: (
                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "auto",
                      md: "auto",
                      lg: "85%",
                      xl: "80%",
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: {
                      xs: "column-reverse",
                      xl: "row",
                    },
                    gap: {
                      xs: "8px",
                      sm: "10px",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: {
                        xs: "column",
                        sm: "row",
                      },
                      width: "100%",
                      gap: {
                        xs: "8px",
                        lg: "10px",
                        xl: "10px",
                      },
                      alignItems: "center",
                    }}
                  >
                    <Paper
                      sx={{
                        p: "2px 5px",
                        display: "flex",
                        alignItems: "center",
                        width: {
                          xs: "100%",
                          sm: "180px",
                          md: "150px",
                          lg: "213px",
                        },
                      }}
                    >
                      <InputBase
                        value={filters.search}
                        onChange={(e) =>
                          setFilters({ ...filters, search: e.target.value })
                        }
                        sx={{
                          ml: {
                            xs: 0.5,
                            lg: 1,
                          },
                          flex: 1,
                          boxShadow: "none",
                        }}
                        placeholder={t("search_leads")}
                        inputProps={{ "aria-label": "search google maps" }}
                      />
                      <IconButton
                        type="button"
                        sx={{
                          p: {
                            xs: "4px",
                            sm: "10px",
                          },
                          paddingX: {
                            xs: "4px",
                            sm: "10px",
                            md: "6px",
                            lg: "10px",
                          },
                        }}
                        aria-label="search"
                      >
                        <IoSearchOutline />
                      </IconButton>
                    </Paper>
                    <Box
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "auto",
                        },
                        display: "flex",
                        gap: {
                          xs: "4px",
                          lg: "10px",
                          xl: "10px",
                        },
                      }}
                    >
                      <MultipleSelect
                        sx={{
                          marginTop: "2px",
                          width: {
                            xs: "100%",
                            sm: "140px",
                            md: "130px",
                            lg: "150px",
                          },
                        }}
                        onChange={(value) => handleFilter("sections", value)}
                        value={filters.sections}
                        names={
                          sections?.map((el) => ({
                            label: el.title,
                            value: el._id,
                          })) || []
                        }
                        label={t("sections")}
                      />
                      <MultipleSelect
                        sx={{
                          marginTop: "2px",
                          width: {
                            xs: "100%",
                            sm: "140px",
                            md: "130px",
                            lg: "150px",
                          },
                        }}
                        onChange={(value) => handleFilter("fromWhere", value)}
                        value={filters.fromWhere}
                        names={
                          sources?.map((el) => ({
                            label: el.title,
                            value: el._id,
                          })) || []
                        }
                        label={t("from_where")}
                      />
                    </Box>
                    <Button
                      startIcon={<GrPowerReset />}
                      variant="contained"
                      color="inherit"
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "auto",
                        },
                        boxShadow: "none",
                        textTransform: "none",
                        bgcolor: "white",
                        border: "none",
                        padding: {
                          xs: "4px 24px",
                          sm: "10px 24px",
                          md: "11px 24px",
                        },
                        whiteSpace: "nowrap",
                      }}
                      disabled={
                        !filters.search &&
                        !filters.sections.length &&
                        !filters.fromWhere.length
                      }
                      onClick={() =>
                        setFilters({
                          sections: [],
                          fromWhere: [],
                          search: "",
                        })
                      }
                    >
                      {t("reset_filter")}
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <Button
                      startIcon={<GoPlus />}
                      variant="contained"
                      color="primary"
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "auto",
                        },
                        boxShadow: "none",
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        padding: {
                          xs: "4px 24px",
                          sm: "10px 24px",
                          md: "11px 24px",
                        },
                      }}
                      onClick={() => setAddLead(true)}
                    >
                      {t("add_new_lead")}
                    </Button>
                  </Box>
                </Box>
              ),
            },
          ]}
        />
      </Stack>
      <AddLead open={addLead} onClose={() => setAddLead(false)} />
    </>
  );
};
