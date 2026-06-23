import pandas as pd
import numpy as np


#Creating a Pandas Series Manually
math_grades = [78, 88, 67]
grades_series = pd.Series(math_grades, name = "Math_Score")
print("---Pandas Series---")
print(grades_series)

# Creating a small Pandas Data Frame manually from a Dictionary

student_dict ={
    "StudentID": ["S001", "S002", "S003"],
    "Name": ["Aarav Sharma", "Neha Limbu", "Rohan Karki"],
    "Course": ["Computing", "Computing", "Business"]
}
small_df = pd.DataFrame(student_dict)
print("\n--- Pandas DataFrame ---")
print(small_df)

df_students = pd.read_csv("E:\\Drive D\\NodeJs\\Python\\Day71\\students_pandas_day4 (1).csv")
print("Dataset loaded successfully")

#1. Look at the first 10 records
print("---Top 10 Row (.head)---")
print(df_students.head(10))

#2. Check the structural layout and data types
df_students.info()

#3. Generate summary statistics for numeric scores
print("\n---Statistics Summary (.describe)---")
print(df_students.describe())

print("\nShape (Rows, Columns):", df_students.shape)

names_column = df_students["Name"]
grades_df = df_students [["Name", "Maths", "Science"]]

computing_filter = df_students["Course"]== "Computing"
computing_students = df_students[computing_filter]

#3. Advance Filtering
high_achievers = df_students[(df_students["Maths"]>=80)&(df_students["Attendance"]>=80)]

print("---Computing Course Students---")
print(computing_students[["Name","Course"]])
print("\n---High Achievers---")
print(high_achievers[["Name", "Maths", "Attendance"]])

# Sorting
top_attendance = df_students.sort_values(by="Attendance", ascending=False)
print(top_attendance)

# accessing cells using label based indexing (.loc)
print(df_students.head(3))
students_course_loc = df_students.loc[1, "Name"]
print(students_course_loc)

# Accessing cells using iloc
student_maths_iloc = df_students.iloc[1:3,5:8]
print(student_maths_iloc)