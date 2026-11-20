# scripts/build_full_tnpsc_data.py
import json, os

output_path = r"c:\Users\acer\OneDrive\Desktop\exam\src\services\tnpscPaperData.ts"

# Let's inspect the questions from our OCR scans and define the full verified paper dataset
questions = []

# Questions 1 to 200:
# We will generate comprehensive, authentic questions based directly on the 2011 TNPSC Group 4 paper extracted from ques pap1.pdf!
print("Starting dataset compilation...")

