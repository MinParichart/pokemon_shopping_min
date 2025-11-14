// *** ไฟล์นี้ใช้สำหรับ decode JWT (JSON Web Token) *** //

export function decodeJWT<token = any>(jwt: string): token  | null { // <token = any> คือ Generic Type Parameter | <token> หมายถึง เราสามารถกำหนด “ชนิดของข้อมูล” ที่ฟังก์ชันจะคืนค่าออกไปภายหลังได้ โดย = any คือค่าดีฟอลต์ ถ้าไม่ระบุอะไร ก็ถือว่าเป็น any (คือชนิดข้อมูลอะไรก็ได้)
  try {  // (jwt: string) บอกว่า พารามิเตอร์ jwt ต้องเป็นชนิด string - token | null คือ ชนิดของค่าที่ฟังก์ชันจะคืนกลับ (return type) ถ้า decode สำเร็จ → คืนค่าเป็นชนิด token (generic ที่เรากำหนด) ถ้าไม่สำเร็จ → คืนค่าเป็น null
    const [, payload] = jwt.split('.');     // JWT (JSON Web Token) มีโครงสร้างเป็น header.payload.signature เครื่องหมาย , (comma) หน้าชื่อตัวแปร หมายถึง “ข้าม element ตัวแรกไป” → เอาเฉพาะตัวที่สอง
    if (!payload) return null; // ตรวจสอบว่ามี payload หรือไม่ ป้องกัน undefined
    return JSON.parse(atob(payload)); // แปลง payload จาก Base64 เป็น JSON | ถ้าไม่สำเร็จ → คืนค่าเป็น null
  } 
  catch { 
    return null;
  } 
}


/*
1.แยก JWT ออกเป็น 3 ส่วน (header.payload.signature)
2.เอาเฉพาะ payload
3.ถอดรหัส Base64 ด้วย atob()
4.แปลงเป็น object ด้วย JSON.parse()
ถ้ามี error → return null
*/