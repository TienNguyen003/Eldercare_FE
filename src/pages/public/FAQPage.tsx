import { useState } from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Card, CardContent, Avatar, Button } from '@mui/material';
import { ExpandMore, HelpOutline, Phone, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHero from '../../components/public/PageHero';

const faqs = [
  {
    category: 'Dịch vụ',
    questions: [
      { q: 'ElderCare cung cấp những dịch vụ gì?', a: 'ElderCare cung cấp dịch vụ quản lý chăm sóc người cao tuổi toàn diện bao gồm: theo dõi chỉ số sức khỏe 24/7, quản lý thuốc và nhắc nhở uống thuốc, lập kế hoạch chăm sóc cá nhân hóa, điều phối nhân viên chăm sóc chuyên nghiệp, và kết nối gia đình qua ứng dụng.' },
      { q: 'Dịch vụ có hoạt động 24/7 không?', a: 'Có, hệ thống giám sát và cảnh báo của ElderCare hoạt động liên tục 24/7. Đội ngũ hỗ trợ kỹ thuật cũng sẵn sàng trong giờ hành chính và hỗ trợ khẩn cấp ngoài giờ.' },
      { q: 'Tôi có thể dùng thử trước khi đăng ký không?', a: 'Có! Chúng tôi cung cấp 30 ngày dùng thử miễn phí với đầy đủ tính năng. Không cần thẻ tín dụng, không cam kết dài hạn.' },
    ],
  },
  {
    category: 'Thanh toán',
    questions: [
      { q: 'Có những gói dịch vụ nào và giá bao nhiêu?', a: 'Chúng tôi có 3 gói: Cơ bản (2.500.000đ/tháng), Tiêu chuẩn (5.000.000đ/tháng) và Cao cấp (8.000.000đ/tháng). Mỗi gói có các tính năng và mức độ hỗ trợ khác nhau. Xem chi tiết tại trang Dịch vụ.' },
      { q: 'Phương thức thanh toán nào được chấp nhận?', a: 'Chúng tôi chấp nhận thanh toán qua chuyển khoản ngân hàng, thẻ tín dụng/ghi nợ (Visa, Mastercard), ví điện tử (MoMo, ZaloPay) và tiền mặt tại văn phòng.' },
      { q: 'Có thể hủy hợp đồng bất kỳ lúc nào không?', a: 'Có, bạn có thể hủy dịch vụ bất kỳ lúc nào mà không phát sinh phí phạt. Dịch vụ sẽ tiếp tục đến hết kỳ thanh toán hiện tại.' },
    ],
  },
  {
    category: 'Kỹ thuật',
    questions: [
      { q: 'Thiết bị nào được hỗ trợ?', a: 'Ứng dụng ElderCare hỗ trợ đầy đủ trên điện thoại iOS và Android, máy tính bảng, và trình duyệt web trên máy tính. Giao diện tự động điều chỉnh phù hợp với từng thiết bị.' },
      { q: 'Dữ liệu sức khỏe có được bảo mật không?', a: 'Tuyệt đối. Toàn bộ dữ liệu được mã hóa end-to-end, lưu trữ trên máy chủ đạt chuẩn ISO 27001. Chúng tôi tuân thủ nghiêm ngặt các quy định về bảo vệ dữ liệu cá nhân.' },
      { q: 'Khi có sự cố kỹ thuật thì liên hệ ai?', a: 'Bạn có thể liên hệ đội ngũ hỗ trợ kỹ thuật qua hotline 1800 1234 (miễn phí), email support@eldercare.vn hoặc chat trực tiếp trong ứng dụng. Thời gian phản hồi trung bình là dưới 2 giờ.' },
    ],
  },
  {
    category: 'Nhân viên',
    questions: [
      { q: 'Nhân viên chăm sóc được đào tạo như thế nào?', a: 'Tất cả nhân viên đều được đào tạo bài bản về kỹ năng chăm sóc người cao tuổi, sơ cứu cơ bản, và sử dụng hệ thống. Họ được đánh giá định kỳ và tham gia các khóa đào tạo nâng cao thường xuyên.' },
      { q: 'Tôi có được chọn nhân viên chăm sóc không?', a: 'Có, bạn hoàn toàn có quyền xem hồ sơ và lựa chọn nhân viên phù hợp. Nếu không hài lòng, chúng tôi sẽ tìm người thay thế trong vòng 24 giờ.' },
    ],
  },
];

export default function FAQPage() {
  const [expanded, setExpanded] = useState<string | false>(false);
  const navigate = useNavigate();

  return (
    <Box>
      <PageHero
        chip="FAQ"
        title="Câu hỏi thường gặp"
        subtitle="Tìm câu trả lời cho những thắc mắc phổ biến nhất về dịch vụ, thanh toán và hỗ trợ kỹ thuật"
        image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=75"
      />

      <Box sx={{ py: 8, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="md">
          {faqs.map((section) => (
            <Box key={section.category} mb={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Box sx={{ width: 4, height: 24, borderRadius: '2px', background: 'linear-gradient(135deg,#0D9488,#10B981)' }} />
                <Typography fontWeight={800} fontSize={18} color="#0F172A">{section.category}</Typography>
              </Box>
              {section.questions.map((item, i) => (
                <Accordion key={i} expanded={expanded === `${section.category}-${i}`}
                  onChange={(_, v) => setExpanded(v ? `${section.category}-${i}` : false)}
                  sx={{ mb: 1.5, border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(15,23,42,0.04)', '&.Mui-expanded': { boxShadow: '0 6px 24px rgba(13,148,136,0.12)', borderColor: '#99F6E4' } }}>
                  <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#64748B' }} />} sx={{ px: 3, py: 0.5, '& .MuiAccordionSummary-content': { my: 1.5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <HelpOutline sx={{ fontSize: 18, color: '#0D9488', flexShrink: 0 }} />
                      <Typography fontWeight={600} fontSize={14.5} color="#0F172A">{item.q}</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pt: 0, pb: 2.5 }}>
                    <Box sx={{ pl: 3.5, borderLeft: '2px solid #BFDBFE' }}>
                      <Typography color="text.secondary" fontSize={14} lineHeight={1.8}>{item.a}</Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ))}

          {/* Still have questions */}
          <Card sx={{ borderRadius: '20px', background: 'linear-gradient(135deg, #0F172A, #123E3C)', mt: 4, border: 'none', boxShadow: '0 20px 45px rgba(15,23,42,0.25)' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={800} color="#fff" mb={1}>Vẫn còn thắc mắc?</Typography>
              <Typography color="#94A3B8" fontSize={15} mb={3}>Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp</Typography>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm="auto">
                  <Button variant="contained" startIcon={<Phone />} onClick={() => navigate('/contact')}
                    sx={{ background: 'linear-gradient(135deg,#0D9488,#10B981)', fontWeight: 700, px: 3, py: 1.5, borderRadius: '12px' }}>
                    Gọi 1800 1234
                  </Button>
                </Grid>
                <Grid item xs={12} sm="auto">
                  <Button variant="outlined" startIcon={<Email />} onClick={() => navigate('/contact')}
                    sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', fontWeight: 700, px: 3, py: 1.5, borderRadius: '12px', '&:hover': { borderColor: '#fff' } }}>
                    Gửi email
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}
