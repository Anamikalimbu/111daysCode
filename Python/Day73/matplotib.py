import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

df_healthcare = pd.read_csv("../Day73/healthcare_eda_dataset (1).csv")

clinical_summary = df_healthcare[["Age", "BMI", "Cholesterol", "Disease_Risk_Score"]].describe()
print(clinical_summary)

correlation_matrix = df_healthcare[[
    "Age", "BMI", "Cholesterol", "Glucose", "Exercise_Hours_Per_Week", "Disease_Risk_Score"
]].corr()
print("--- Clinical Metrics Correlation Matrix ---")
print(correlation_matrix)

x = np.linspace(0,10,100)
print(x)

y1 = x**2 # Quadratic Growth Function: f(x) = x^2
y2 = 10*x # Linear baseline growth: g(x) = 10x

plt.plot(x,y1,label="f(x)=x^2", color= "blue", linestyle="-", linewidth=2)
plt.plot(x,y2,label="g(x)=10x", color= "red", linestyle="--", linewidth=2)

plt.title("Line Plot", fontsize=14, fontweight="bold")
plt.xlabel("Independent Variable (X Range)", fontsize=12)
plt.ylabel("Dependent Variable (Y Range)", fontsize=12)
plt.legend(loc="lower right")
plt.grid(True, linestyle=":", alpha=0.6) 
plt.savefig("line_plot_functions.png",bbox_inches="tight")
# plt.close()

df_election = pd.read_csv("../Day73/election_data.csv")
df_district = pd.read_csv("../Day73/district_data (1).csv")
df_province = pd.read_csv("../Day73/province_data.csv")

df_master=pd.merge(
    df_election,
    df_district,
    on="district_id",
    how="inner"
    ).merge(df_province,
           on="province_id",
            how="left"
            )
    
plt.scatter(df_master["age"],df_master["votes"],color="green",alpha=0.5, edgecolors="none", s=30)
plt.title("Candidate Age vs votes Received", fontsize=14, fontweight="bold")
plt.xlabel("Cabdidate Age (Year)", fontsize=12)
plt.ylabel("Total Votes Counted", fontsize=12)
plt.grid(True, linestyle=":", alpha=0.3)
plt.savefig("Candidate_age_vs_vote_scatter.png",bbox_inches="tight")

party_counts = df_master["party"].value_counts().head(5).sort_values(ascending=True)
party_counts

plt.barh(party_counts.index,party_counts.values, color="teal")
plt.title("Top 5 Political Parties by Candidate Volume", fontsize=14, fontweight="bold")
plt.xlabel("Total Registered Candidates", fontsize=12)
plt.xticks(rotation="vertical")
plt.ylabel("Political Party Affiliation", fontsize=12)
plt.savefig("top_parties_chart.png", bbox_inches="tight")

gender_distribution = df_master["gender"].value_counts()
gender_distribution

plt.pie(
    gender_distribution.values,
    labels=gender_distribution.index,
    autopct="%1.1f%%",
    colors = ["skyblue","pink","black"],
    startangle=90,
    pctdistance=0.9
)
plt.title("Candidate Gender Representation Share", fontsize=14, fontweight="bold")


plt.hist(df_master["age"],bins=15, color="purple",edgecolor="black",alpha=0.8)
plt.title("National Candidate Age Distribution", fontsize=14, fontweight="bold")
plt.xlabel("Candidate Age (Year)", fontsize=12)
plt.ylabel("Total Registered Candidates", fontsize=12)
plt.grid(True,axis="y", linestyle="--", alpha=0.5)
plt.savefig("candidate_age_histogram.png", bbox_inches="tight")

province_order = df_master.groupby("province_name")["age"].median().sort_values().index
print(province_order)


sns.set_theme(style="whitegrid")
sns.boxplot(
    data=df_master,
    x="age",
    y="province_name",
    hue="province_name",
    order=province_order,
    palette="Set3"
)
plt.title("Candidate Age Distribution by Province", fontsize=14, fontweight="bold")
plt.xlabel("Candidate Age (Year)", fontsize=12)
plt.ylabel("Province Name", fontsize=12)
plt.show()

