/**
 * Bản đồ nhãn tiếng Việt tập trung cho các giá trị enum/trường tự do từ backend.
 * Mọi chỗ hiển thị giá trị thô (FALL, LAB_RESULT, PERSONAL_CARE...) đều nên đi qua đây.
 */

/** Chuyển giá trị thô thành chữ dễ đọc: 'MEDICATION_ERROR' -> 'Medication error' */
export const humanize = (v?: string | null): string => {
  if (!v) return '—';
  return v
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\p{L}/u, (c) => c.toUpperCase());
};

/** Loại sự cố */
export const INCIDENT_TYPE_LABELS: Record<string, string> = {
  FALL: 'Ngã',
  SLIP: 'Trượt ngã',
  ILLNESS: 'Bất ổn sức khỏe',
  INJURY: 'Chấn thương',
  MEDICATION_ERROR: 'Nhầm lẫn thuốc',
  WANDERING: 'Đi lạc',
  CHOKING: 'Sặc, nghẹn',
  BEHAVIOR: 'Hành vi bất thường',
  EQUIPMENT: 'Sự cố thiết bị',
  OTHER: 'Khác',
};
export const incidentTypeLabel = (t?: string | null): string =>
  (t && INCIDENT_TYPE_LABELS[t]) || humanize(t);

/** Loại tài liệu */
export const DOC_TYPE_LABELS: Record<string, string> = {
  LAB_RESULT: 'Kết quả xét nghiệm',
  PRESCRIPTION: 'Đơn thuốc',
  REPORT: 'Báo cáo y tế',
  ID_DOCUMENT: 'Giấy tờ tùy thân',
  INSURANCE: 'Bảo hiểm',
  OTHER: 'Khác',
};
export const docTypeLabel = (t?: string | null): string =>
  (t && DOC_TYPE_LABELS[t]) || humanize(t);

/** Loại lịch chăm sóc */
export const SCHEDULE_TYPE_LABELS: Record<string, string> = {
  PERSONAL_CARE: 'Chăm sóc cá nhân',
  HEALTH_CHECK: 'Theo dõi sức khỏe',
  MEDICATION: 'Uống thuốc',
  EXERCISE: 'Vận động',
  MEAL: 'Bữa ăn',
  COMPANIONSHIP: 'Đồng hành, trò chuyện',
  HOUSEKEEPING: 'Dọn dẹp',
  TRANSPORT: 'Đưa đón',
  OTHER: 'Khác',
};
export const scheduleTypeLabel = (t?: string | null): string =>
  (t && SCHEDULE_TYPE_LABELS[t]) || humanize(t);
