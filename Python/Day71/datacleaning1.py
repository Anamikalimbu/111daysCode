import pandas as pd
import numpy as np

df = pd.read_csv("E:\\Drive D\\NodeJs\\Python\\Day71\\employee_data_messy (1).csv")

print("---Data Summary---")
df.info()

print("\n---Missing Value Tally---")
print(df.isnull().sum())

#Drop rows where critical identifying criteria is absent (eg. name)
df_clean = df.dropna(subset=["Name"])

print(df_clean.head(5))

#imputing and converting non numeric values
df_clean['Salary']=df_clean["Salary"].astype(str).replace(',','',regex=False)
df_clean['Salary']=pd.to_numeric(df_clean['Salary'],errors='coerce')
salary_median = df_clean['Salary'].median()
df_clean['Salary'] = df_clean['Salary'].fillna(salary_median)

#replaceing missing categorical fields (Department) with a descriptive text "Unassigned"
df_clean['Department'] = df_clean['Department'].fillna('Unassigned')

print("---Missing Value After Initial Fixes")
print(df_clean.isnull().sum()[['Name','Salary','Department']])

duplicate_count = df_clean.duplicated().sum()
print(f"Total perfect duplicate roun found: {duplicate_count}")

#redundant rows
df_clean = df_clean.drop_duplicates()
print(f"Total valid unique records remaining: {len(df_clean)}")

#Replace alphabetical text entry strings with actual numerical string metrics
df_clean["Age"] = df_clean["Age"].replace("Thirty", "30")
df_clean["Age"] = df_clean["Age"].replace("twenty-eight","28")

#Coerce the column values to a numeric datatype safely
df_clean['Age']=pd.to_numeric(df_clean['Age'], errors='coerce')


# Fill any new NaN values(from broken parsing) with column median, then cast to  integer
age_median = df_clean["Age"].median()
df_clean['Age']= df_clean['Age'].fillna(age_median).astype(int)


df_clean["JoiningDate"]=pd.to_datetime(df_clean['JoiningDate'],errors='coerce')

# Standaridze and transform date string into true Datetime format structures
print("---Structural Data Type Conversion Verified---")
print(df_clean[['Age','JoiningDate']].dtypes)

df_clean["Name"]=df_clean["Name"].str.strip()
df_clean["City"]=df_clean["City"].str.strip()

df_clean["Name"]=df_clean["Name"].str.title()
df_clean["City"]=df_clean["City"].str.title()

df_clean['Department']=df_clean['Department'].str.upper()

#Fill remaining missing city spaces with a standard placeholder value
df_clean['City']=df_clean['City'].fillna('Unknown')

print("---Cleaned Text Field---")
print(df_clean[["Name","Age","Department","City"]].head(10))

df_clean.info()

df_clean['Email']= df_clean['Email'].fillna("Unknown")

print(df_clean[["Name",'Email']].head(10))

df_clean.info()