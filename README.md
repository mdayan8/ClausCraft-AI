# ClauseCraft AI – AI-Powered Legal Assistant 🚀  

ClauseCraft AI is an **AI-driven legal assistant** that helps users **analyze contracts, detect risks, and generate agreements** using **FOSS-compliant AI models**.  

---

## 🔹 Features  
✅ **AI Contract Analysis** – Upload PDFs/Text & get AI-generated legal insights.  
✅ **Risk Detection & Redlining** – AI highlights risky clauses (e.g., termination, penalties, liability).  
✅ **AI Contract Generator** – Generate NDAs, Freelancer Agreements, & more.  
✅ **Legal AI Chatbot** – Get AI-powered answers to legal queries.  
✅ **Multi-Language Support** – Supports contract analysis in multiple languages.  
✅ **Secure Storage & Management** – Store & manage contracts with **Supabase (PostgreSQL)**.  
✅ **User Authentication** – Secure login/signup using **Clerk/Auth.js**.  
✅ **Version Control** – Track contract modifications with **audit history**.  

---

## 🔧 Tech Stack  

### **Frontend:**  
- **React.js (Next.js) + TypeScript** – Scalable and responsive UI.  
- **TailwindCSS + DaisyUI** – Fast and modern styling.  
- **Axios** – Seamless API communication.  
- **React-PDF** – For rendering and highlighting PDFs.  
- **ShadCN/UI** – Enhanced UI experience.  

### **Backend:**  
- **FastAPI (Python)** – Fast, efficient, and scalable backend.  
- **Transformers & Torch** – AI-based contract analysis.  
- **PDFPlumber & PyMuPDF (Fitz)** – Text extraction from PDFs.  
- **Tesseract OCR** – Extracts text from scanned/image-based contracts.  
- **Celery & Redis** – Background task processing (e.g., AI analysis jobs).  
- **Hugging Face API** – Uses **Mistral/Gemma models** for contract risk detection & generation.  
- **Port:** Runs on an **odd port (e.g., 8501)** to avoid conflicts.  

### **Database & Storage:**  
- **Supabase (PostgreSQL)** – Secure contract storage & retrieval.  
- **MinIO / AWS S3** – Contract file storage.  

### **Authentication & Security:**  
- **Clerk/Auth.js** – Secure user authentication.  
- **JWT Tokens** – Session management.  
- **AES Encryption** – Contract security.  

---

## 📌 Getting Started  

### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/mdayan8/ClauseCraft-AI.git
cd ClauseCraft-AI
