import { BoldTabs } from "@/components";
import { Box, Button, Stack } from "@mui/material";
import { GoPlus } from "react-icons/go";
import { Branches, Admins } from "./_components";
import { useState } from "react";
import { AddBranch, AddEmployee } from "./_components/Modal";
import { useTranslation } from "react-i18next";

export type Modal = "employee" | "branch" | null;

export function Ceo() {
  const { t } = useTranslation("", { keyPrefix: "settings.ceo" });
  const [openModal, setOpenModal] = useState<{
    name: Modal;
  }>({ name: null });
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedAdmin, setSelectedAdmin] = useState<string>("");
  const handleOpenModal = () => {
    setOpenModal({ name: null });
    setSelectedBranch("");
    setSelectedAdmin("");
  };

  return (
    <div className="pb-10">
      <Stack direction="row" sx={{ pb: 10 }} justifyContent={"space-between"}>
        <BoldTabs
          tabs={[
            {
              label: t("admins.title"),
              children: (
                <Admins
                  onModalChange={() => setOpenModal({ name: "employee" })}
                  setSelectedAdmin={setSelectedAdmin}
                />
              ),
              value: "Staff",
              leftSideContent: (
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  <Button
                    startIcon={<GoPlus />}
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenModal({ name: "employee" })}
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
                  >
                    {t("admins.button")}
                  </Button>
                </Box>
              ),
            },
            {
              label: t("branches.title"),
              children: (
                <Branches
                  onModalChange={() => setOpenModal({ name: "branch" })}
                  setSelectedBranch={setSelectedBranch}
                />
              ),
              value: "Branches",
              leftSideContent: (
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  <Button
                    startIcon={<GoPlus />}
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenModal({ name: "branch" })}
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
                  >
                    {t("branches.button")}
                  </Button>
                </Box>
              ),
            },
          ]}
        />
      </Stack>
      <AddEmployee
        selectedAdminId={selectedAdmin}
        open={openModal.name === "employee"}
        onClose={handleOpenModal}
      />
      <AddBranch
        id={selectedBranch}
        open={openModal.name === "branch"}
        onClose={handleOpenModal}
      />
    </div>
  );
}
