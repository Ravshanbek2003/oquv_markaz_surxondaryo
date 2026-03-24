import { BoldTabs } from "@/components";
import { Box, Button, Stack } from "@mui/material";
import { GoPlus } from "react-icons/go";
import { Courses, Rooms, SMSTemplates } from "./_components";
import { useState } from "react";
import { AddCourse, AddRooms, AddSmsTemplate } from "./_components/Modals";
import { useTranslation } from "react-i18next";

export const Office = () => {
  const { t } = useTranslation("", { keyPrefix: "settings.office" });
  const [openModals, setOpenModals] = useState<{
    name: "course" | "room" | "sms" | null;
  }>({ name: null });
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const handleCloseModal = () => {
    setOpenModals({ name: null });
    setTimeout(() => {
      setSelectedRoom("");
      setSelectedTemplate("");
    }, 500);
  };

  return (
    <div className="pb-10 w-full">
      <Stack direction="row" sx={{ pb: 4 }} justifyContent={"space-between"}>
        <BoldTabs
          tabs={[
            {
              label: `${t("courses_tabs.title")}`,
              children: <Courses />,
              value: "courses",
              leftSideContent: (
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  <Button
                    startIcon={<GoPlus />}
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenModals({ name: "course" })}
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
                    {t("courses_tabs.button")}
                  </Button>
                </Box>
              ),
            },
            {
              label: `${t("rooms_tabs.title")}`,
              children: (
                <Rooms
                  setSelectedRoom={setSelectedRoom}
                  onOpenChange={() => setOpenModals({ name: "room" })}
                />
              ),
              value: "rooms",
              leftSideContent: (
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  <Button
                    startIcon={<GoPlus />}
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenModals({ name: "room" })}
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
                    {t("rooms_tabs.button")}{" "}
                  </Button>
                </Box>
              ),
            },
            {
              label: `${t("sms_templates.title")}`,
              children: (
                <SMSTemplates
                  onModalChange={() => setOpenModals({ name: "sms" })}
                  setSelectedTemplate={setSelectedTemplate}
                />
              ),
              value: "SMSTemplates",
              leftSideContent: (
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  <Button
                    startIcon={<GoPlus />}
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenModals({ name: "sms" })}
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
                    {t("sms_templates.button")}
                  </Button>
                </Box>
              ),
            },
            // === DON'T DELETE THIS COMMENT ===
            // {
            //   label: "SMS Logs",
            //   children: <SMSLogs />,
            //   value: "SMSLogs",
            // },
          ]}
        />
      </Stack>
      <AddCourse
        open={openModals.name === "course"}
        onClose={handleCloseModal}
      />
      <AddRooms
        roomId={selectedRoom}
        open={openModals.name === "room"}
        onClose={handleCloseModal}
      />
      <AddSmsTemplate
        templateId={selectedTemplate}
        open={openModals.name === "sms"}
        onClose={handleCloseModal}
      />
    </div>
  );
};
