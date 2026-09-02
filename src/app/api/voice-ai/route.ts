import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, language = "vi" } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Tin nhắn không hợp lệ" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || "";

    const systemPrompt = `Bạn là Trợ lý Giọng nói AI đại diện cho Kỹ sư Lý Văn Mỹ (Software Engineer hướng tới vị trí Software Architect).
Nhiệm vụ của bạn là trò chuyện trực tiếp qua giọng nói với Khách hàng và Nhà tuyển dụng (HR).

THÔNG TIN CHÍNH XÁC VỀ LÝ VĂN MỸ:
- Họ tên: Lý Văn Mỹ (LVSTANTS)
- Học vấn: Đã tốt nghiệp Đại học FPT chuyên ngành Kỹ thuật Phần mềm (Software Engineering).
- Định hướng nghề nghiệp: Software Architect (Kiến trúc sư Phần mềm Doanh nghiệp, Microservices & Hệ thống Cảng biển/Fintech).
- Kinh nghiệm thực tế:
  1. GTOS - Hệ thống Điều hành Cảng Quốc tế Mỹ Thủy (MTIP) tại CEH Platform (05/2026 - Hiện tại):
     - Xây dựng các module cốt lõi Terminal Operating System (TOS): Berth Planning, Cargo Operations, Tariff Billing.
     - Phát triển biểu đồ không gian - thời gian 2D 'BA Map' trực quan hóa 1,200m+ tuyến cầu cảng với lịch ETA/ETB/ETD thời gian thực.
     - Xây dựng Booking Allocation engine và hệ thống tính cước đa tầng (GT, HP, MT, TEU).
     - Refactoring backend controllers sang kiến trúc modular đạt 0% lỗi hồi quy.
  2. SmartGate Cảng Hải Phòng & BIDV Banking tại CEH Platform (02/2025 - 05/2025):
     - Tự động hóa kiểm soát container ra/vào cổng cảng với camera OCR tốc độ cao & PostgreSQL.
     - Phát triển giao diện Dashboard Ngân hàng BIDV bảo mật cao bằng Next.js & TypeScript.
- Bộ kỹ năng: Next.js 15, React 19, TypeScript, Node.js, NestJS, .NET 9.0, PostgreSQL, MongoDB, Docker, Redis, Tailwind CSS.
- Liên hệ: Email lyvanmy357@gmail.com, Số điện thoại 0915461265, GitHub lvstants03, Facebook Myx2406.

QUY TẮC PHẢN HỒI (BẮT BUỘC):
- NẾU NGƯỜI DÙNG NÓI TIẾNG VIỆT HOẶC CÂU HỎI LÀ TIẾNG VIỆT: BẠN BẮT BUỘC PHẢI TRẢ LỜI 100% BẰNG TIẾNG VIỆT TỰ NHIÊN, LỊCH THIỆP VÀ TỰ TIN.
- Trả lời ngắn gọn từ 1 đến 2 câu súc tích (được thiết kế riêng để phát ra giọng nói âm thanh mượt mà).
- Không dùng markdown (*, #, bullet) hay emoji trong trường response.

ĐIỀU KHIỂN MÀN HÌNH (FUNCTION CALLING):
- Nếu người dùng muốn xem/mở/cuộn tới dự án, cảng Mỹ Thủy, GTOS, demo: action = "NAVIGATE_SECTION", target = "projects"
- Nếu muốn xem kinh nghiệm, quá trình làm việc, CEH: action = "NAVIGATE_SECTION", target = "experience"
- Nếu muốn xem kỹ năng, công nghệ, stack: action = "NAVIGATE_SECTION", target = "skills"
- Nếu muốn xem giới thiệu, học vấn, đại học FPT: action = "NAVIGATE_SECTION", target = "introduce"
- Nếu muốn xem chứng chỉ, bằng cấp: action = "NAVIGATE_SECTION", target = "certificates"
- Nếu muốn về đầu trang, trang chủ: action = "NAVIGATE_SECTION", target = "home"
- Nếu muốn tải CV, resume, hồ sơ: action = "DOWNLOAD_CV", target = "/Lý_Văn_Mỹ_cv.pdf"
- Các trường hợp khác: action = null, target = null

ĐỊNH DẠNG JSON XUẤT RA:
{
  "response": "Câu trả lời bằng tiếng Việt ngắn gọn để phát âm thanh",
  "action": "NAVIGATE_SECTION" | "DOWNLOAD_CV" | null,
  "target": "projects" | "experience" | "skills" | "introduce" | "certificates" | "home" | "/Lý_Văn_Mỹ_cv.pdf" | null
}`;

    // Gọi Gemini API
    if (apiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const aiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\nCâu nói/câu hỏi của người dùng: "${message}"` }]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.6,
              maxOutputTokens: 250
            }
          })
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const rawText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return NextResponse.json(parsed);
          }
        }
      } catch (err) {
        console.warn("Lỗi Gemini API, chuyển sang Fallback Engine:", err);
      }
    }

    // Fallback Engine Tiếng Việt Thông Minh
    const lower = message.toLowerCase();
    let response = "Tôi là Voice AI của Lý Văn Mỹ. Bạn có thể hỏi tôi về kinh nghiệm làm hệ thống Cảng biển, kỹ năng hoặc yêu cầu mở các mục trên website.";
    let action: string | null = null;
    let target: string | null = null;

    if (lower.includes("dự án") || lower.includes("cảng") || lower.includes("mỹ thủy") || lower.includes("gtos") || lower.includes("project")) {
      response = "Tôi đang mở phần Dự án cho bạn. Mỹ đã xây dựng hệ thống GTOS Cảng Quốc tế Mỹ Thủy với bản đồ BA Map 1,200 mét và tích hợp SmartGate OCR.";
      action = "NAVIGATE_SECTION";
      target = "projects";
    } else if (lower.includes("kinh nghiệm") || lower.includes("làm việc") || lower.includes("ceh") || lower.includes("quá trình") || lower.includes("experience")) {
      response = "Đang chuyển đến phần Kinh nghiệm làm việc. Mỹ có kinh nghiệm thực chiến từ đầu năm 2025 đến nay tại CEH Platform, chuyên xây dựng hệ thống điều hành cảng biển TOS GTOS và giao diện ngân hàng BIDV.";
      action = "NAVIGATE_SECTION";
      target = "experience";
    } else if (lower.includes("kỹ năng") || lower.includes("công nghệ") || lower.includes("ngôn ngữ") || lower.includes("skill") || lower.includes("tech")) {
      response = "Đây là Ma trận Kỹ thuật của Mỹ, bao gồm Next.js, React 19, Node.js, NestJS, .NET 9.0 và Docker microservices.";
      action = "NAVIGATE_SECTION";
      target = "skills";
    } else if (lower.includes("tải cv") || lower.includes("tải hồ sơ") || lower.includes("download") || lower.includes("cv") || lower.includes("resume")) {
      response = "Đang tải hồ sơ CV chính thức của Lý Văn Mỹ cho bạn.";
      action = "DOWNLOAD_CV";
      target = "/Lý_Văn_Mỹ_cv.pdf";
    } else if (lower.includes("chứng chỉ") || lower.includes("bằng cấp") || lower.includes("certificate")) {
      response = "Mời bạn xem qua các chứng chỉ và chứng nhận chuyên môn của Mỹ.";
      action = "NAVIGATE_SECTION";
      target = "certificates";
    } else if (lower.includes("giới thiệu") || lower.includes("học vấn") || lower.includes("bản thân") || lower.includes("fpt") || lower.includes("about")) {
      response = "Mỹ đã tốt nghiệp Đại học FPT chuyên ngành Kỹ thuật Phần mềm và đang phát triển theo định hướng Software Architect.";
      action = "NAVIGATE_SECTION";
      target = "introduce";
    } else if (lower.includes("đầu trang") || lower.includes("trang chủ") || lower.includes("trên cùng") || lower.includes("home") || lower.includes("top")) {
      response = "Đang đưa bạn về đầu trang chủ.";
      action = "NAVIGATE_SECTION";
      target = "home";
    }

    return NextResponse.json({ response, action, target });
  } catch (error) {
    console.error("Lỗi xử lý Voice AI API:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống xử lý giọng nói" },
      { status: 500 }
    );
  }
}
