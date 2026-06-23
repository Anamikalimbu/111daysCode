import pandas as pd
import numpy as np

df = pd.read_csv("E:\\Drive D\\NodeJs\\Python\\Day71\\Finance_data.csv")

# Fix age
df['age'] = df['age'].replace({'Twenty-three': 23})
df['age'] = pd.to_numeric(df['age'], errors='coerce')

# Missing values
df['age'] = df['age'].fillna(df['age'].median())
df['Investment_Avenues'] = df['Investment_Avenues'].fillna(
    df['Investment_Avenues'].mode()[0]
)

# Remove duplicates
df = df.drop_duplicates()

# Rename typo
df.rename(columns={'Stock_Marktet':'Stock_Market'}, inplace=True)

# Clean column names
df.columns = (
    df.columns
      .str.strip()
      .str.lower()
      .str.replace(' ', '_')
      .str.replace('?', '', regex=False)
)

print(df.info())

binary_cols = ['investment_avenues', 'stock_market']

for col in binary_cols:
    df[col] = df[col].map({
        'Yes': 1,
        'No': 0
    })
for col in binary_cols:
    if col in df.columns:
        print(f"{col} found")
    else:
        print(f"{col} NOT found")
print(df.columns.tolist())

for col in [
    'equity_market','debentures',
    'government_bonds','fixed_deposits',
    'ppf','gold'
]:
    print(col, df[col].unique())