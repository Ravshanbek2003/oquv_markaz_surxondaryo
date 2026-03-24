export const formatUzbekPhoneNumber = (input: string): string => {
  if (!input) return "";
  let cleaned = input?.replace(/\D/g, "");

  if (cleaned.startsWith("998")) {
    cleaned = cleaned.slice(3);
  }

  let formatted = "+998";

  if (cleaned.length > 0) {
    formatted += ` (${cleaned.slice(0, 2)}`;
  }
  if (cleaned.length > 2) {
    formatted += `) ${cleaned.slice(2, 5)}`;
  }
  if (cleaned.length > 5) {
    formatted += `-${cleaned.slice(5, 7)}`;
  }
  if (cleaned.length > 7) {
    formatted += `-${cleaned.slice(7, 9)}`;
  }

  return formatted;
};

export const unformatUzbekPhoneNumber = (formatted: string): string => {
  return formatted.replace(/[\s\-,()+]/g, "");
};
