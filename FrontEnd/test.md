product-add-to-cart.impl.spec.ts
ทดสอบการเพิ่มสินค้าในตะกร้าและสั่งซื้อ (TC-PROD-ADD-01-impl).
ม็อก auth/products/orders เพื่อให้ deterministic — ยืนยันว่าออร์เดอร์ที่สร้างแล้วปรากฏในหน้า "รายการสั่งซื้อของฉัน".

products.impl.spec.ts
Smoke / happy-path สำหรับหน้าแสดงสินค้า (TC-PROD-01-impl).
ม็อก login + products แล้วยืนยันว่า list/card ของสินค้าปรากฏหลังล็อกอิน.

products-api-error.impl.spec.ts ทดสอบเส้นทาง error (TC-PROD-ERR-01-impl).
ม็อก API ส่ง 500 แล้วยืนยันว่า UI แสดงผลอย่างสุภาพ (ไม่มีการ์ดสินค้า) โดยไม่แครช.

product-stock-limit.impl.spec.ts ตรวจสอบการจำกัดสต็อก (TC-PROD-05-impl).
สร้างสินค้าจากฝั่ง admin ด้วยสต็อกต่ำ แล้วยืนยันว่าผู้ใช้ไม่สามารถเพิ่มเกินจำนวนได้ (ตรวจ toast/message).

order-status-transition.impl.spec.ts
ไหลงานออร์เดอร์แบบ end-to-end (TC-ORDER-STATUS-01-impl).
ผู้ใช้สั่งของ → admin ยืนยันคำสั่งซื้อ (admin ทำงานบนหน้าแยก) โดยใช้ม็อกออร์เดอร์ที่เปลี่ยนสถานะได้.

order-cancel.impl.spec.ts
สร้างออร์เดอร์แล้วยกเลิก (TC-PROD-06-impl).
ยืนยันว่าเมื่อยกเลิกแล้ว UI แสดงสถานะ/ข้อความยืนยันการยกเลิก.

auth.impl.spec.ts
ทดสอบการล็อกอินพื้นฐาน (TC-AUTH-01-impl).
ม็อก auth/login และยืนยันการเปลี่ยนเส้นทางไปหน้า /products.

admin-single-reject.impl.spec.ts
Admin ปฏิเสธออร์เดอร์ทีละรายการ (TC-ORDER-REJECT-01-impl).
เปิดแถวข้อมูล → กดปฏิเสธ → ยืนยันว่าแถวแสดงสถานะปฏิเสธ.

admin-edit-product.impl.spec.ts
Admin แก้ไขสินค้า (TC-ADMIN-PROD-EDIT-01-impl).
สร้างสินค้า ทดสอบหน้าแก้ไข และยืนยันว่าชื่อ/ราคาถูกอัพเดตในตาราง.

admin-delete-product.impl.spec.ts
Admin ลบสินค้า (TC-ADMIN-PROD-DELETE-01-impl).
สร้างสินค้าแล้วลบทิ้ง → ยืนยันว่าไม่ปรากฏในตารางอีกต่อไป.

admin-create-product.impl.spec.ts
Admin สร้างสินค้าใหม่ (TC-ADMIN-PROD-01-impl).
ม็อก admin/login และ products → ยืนยันว่าสินค้าที่สร้างปรากฏในรายการ.

admin-bulk-reject-orders.impl.spec.ts
Admin ปฏิเสธหลายคำสั่งพร้อมกัน (TC-ORDER-BULK-REJECT-01-impl).
เลือกทั้งหมด → ใช้ action ปฏิเสธ → ยืนยันว่าแถวแสดงสถานะปฏิเสธ.

admin-bulk-confirm-orders.impl.spec.ts
Admin ยืนยันหลายคำสั่งพร้อมกัน (TC-ORDER-BULK-CONFIRM-01-impl).
เลือกทั้งหมด → ยืนยัน → ตรวจ badge/ข้อความว่าเป็น ‘ยืนยันคำสั่งซื้อ’.

unauthorized-access.impl.spec.ts
ตรวจการเข้าถึง admin โดยไม่ใช่ admin (TC-AUTH-UNAUTH-01-impl).
ตั้ง token non-admin แล้วเข้าหน้า /admin/\* → ยืนยันว่าถูก redirect ไป /products.
