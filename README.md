# Learn refatoring

👋 สวัสดี, repo นี้จะเป็นการฝึก refactor โค้ดคับ เหมาะทั้ง frontend และ backend engineer เลย

- เขียน javascript พอได้
- ไม่จำเป็นต้องมีความรู้ React 
- ไม่จำเป็นต้องมีความรู้ CSS

## Introduction

ผมตั้งใจสร้าง repo นี้ขึ้นมาเนื่องจากเป็นโค้ดที่ผ่านการใช้งานมาจริงๆ และเป็น business requirement ที่เกิดขึ้นจริง เหมาะสำหรับการฝึกฝนมากๆ หวังว่าจะเป็นประโยชน์กับทุกๆท่านที่ผ่านมาเห็นนะครับ

โค้ดทั้งหมดผมได้มาจาก [MUI repository](https://github.com/mui/material-ui/blob/master/docs/src/modules/utils/getDemoConfig.js)

หลังจาก clone โปรเจคแล้วลองรัน `yarn && yarn start`

จะได้หน้าจอแบบนี้ขึ้นมา

<img width="1094" alt="Screen Shot 2565-05-14 at 21 29 36" src="https://user-images.githubusercontent.com/18292247/168430061-b9c10a1d-2831-4f05-b694-315ff8eae632.png">

## How to practice

เพื่อให้เสมือนจริงมากที่สุด ให้เริ่มทำความเข้าใจโค้ดเองทั้งหมดว่า application นี้เกี่ยวกับอะไร ทำงานอย่างไร จากนั้นให้อ่าน [Challenges](#challenges) แล้วเริ่มลงมือทำ

ถ้าไม่เข้าใจจริงๆ ให้อ่าน hint ได้

<details>
  
  <summary>💡 hint</summary>
  
  Application นี้เป็นเว็บไซต์สำหรับนักพัฒนาเพื่อเข้ามาดูโค้ดตัวอย่างแล้วนำไปใช้ ในกรณีที่ต้องการทดสอบโค้ดตัวอย่างสามารถเลือกเปิด interactive demo ได้สองแบบผ่าน [CodeSandbox](https://codesandbox.io/) หรือ [StackBlitz](https://stackblitz.com/).

  **การทำงาน**

  - การทำงานทั้งหมดจะเริ่มจากไฟล์ `src/App.js` เมื่อ user กดปุ่ม ข้อมูลจะถูกประมวลผลให้อยู่ในรูปแบบที่ CodeSandbox หรือ StackBlitz ต้องการ
  - ข้อมูลนั้นจะนำมาใช้ในการเรียก API เพื่อสร้าง sandbox
    - [CodeSanbox API](https://codesandbox.io/docs/api/#define-api)
    - [StackBlitz API](https://developer.stackblitz.com/docs/platform/post-api/)
</details>

## Challenges

### 1. Bug fix

เมื่อกดปุ่ม StackBlitz จะเห็นว่า demo ไม่สามารถทำงานได้

https://user-images.githubusercontent.com/18292247/168430133-8f3f5f06-65dc-4997-b5b2-549eadcc6899.mov

**Requirement**

ให้เพิ่ม `@babel/runtime` เข้าไปใน dependencies ของ StackBlitz เท่านั้น เมื่อกดปุ่ม StackBlitz จะต้องเห็น demo ที่ทำงานได้ถูกต้องทันที

### 2. Multiple products

โค้ดตัวอย่างที่เห็นอยู่นั้นเป็น demo ของ Material UI ซึ่งเป็นหนึ่งในไลบรารี่ที่เรามี ทางบริษัทต้องการเพิ่มไลบรารี่ให้มากขึ้นโดยแต่ละไลบรารี่จะต้องมีไฟล์ template ที่แตกต่างกัน หากเปิดดูโค้ดที่อยู่ในไฟล์ `getDemoConfig.js` จะเห็นว่าฟังก์ชัน `tsDemo()` และ `jsDemo()` มี config เกี่ยวกับไฟล์ `index.js` ด้วยซึ่งเป็นส่วนหนึ่งของ template.

ไฟล์ `src/challenges/templates.js` มีโค้ดตัวอย่างของอีกหนึ่งไลบรารี่ที่ชื่อ Joy UI.

โจทย์คือให้ refactor โค้ด เพื่อนำ Joy UI มาแสดงเป็น demo และเปิด CodeSandbox กับ StackBlitz ได้ถูกต้อง

> ในอนาคตจะมีไลบรารี่เพิ่มขึ้นอีกแน่นอน ฉะนั้นให้คำนึงถึงเรื่องนี้ตอน refactor โค้ดด้วย


