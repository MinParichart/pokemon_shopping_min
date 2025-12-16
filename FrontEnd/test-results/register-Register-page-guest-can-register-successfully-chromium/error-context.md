# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - img "Shop Logo" [ref=e9]
      - heading "POKEMON" [level=1] [ref=e10]
      - paragraph [ref=e13]: Pokemon Shop
    - generic [ref=e17]:
      - heading "ลงทะเบียนสมาชิกใหม่" [level=1] [ref=e18]
      - generic [ref=e19]:
        - generic [ref=e20]:
          - generic [ref=e21]: Username *
          - textbox [ref=e23]: minnietest
        - generic [ref=e24]:
          - generic [ref=e25]: ชื่อ - นามสกุล *
          - textbox [ref=e27]: minnietest
        - generic [ref=e28]:
          - generic [ref=e29]: เบอร์โทรศัพท์ *
          - textbox [ref=e31]: "22222222"
        - generic [ref=e32]:
          - generic [ref=e33]:
            - generic [ref=e34]: Password *
            - textbox [ref=e36]: minnietest
          - generic [ref=e37]:
            - generic [ref=e38]: ยืนยัน Password *
            - textbox [ref=e40]: minnietest
        - button "ลงทะเบียน" [ref=e42]:
          - generic [ref=e43]: ลงทะเบียน
        - link "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ" [ref=e45] [cursor=pointer]:
          - /url: /login
      - paragraph [ref=e46]: ลงทะเบียนไม่สำเร็จ (ชื่อผู้ใช้อาจซ้ำ)
  - paragraph [ref=e47]: © 2025 WUNCA POKEMON SHOP
```