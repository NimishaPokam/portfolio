---
title: "Digitalisation Impact on Economic Growth"
date: 2025-03-14
draft: false
summary: "Exploring the relationship between digitalization and economic growth using Python libraries for data analysis and visualization."
---
## Overview
This project explores the relationship between **digitalization** and **economic growth** using a **Cobb-Douglas production function framework**. By analyzing how digitalization indicators and macroeconomic variables influence GDP per capita across countries, I aim to uncover insights into the role of technology in shaping economies.

The dataset, sourced from [Mendeley Data](https://data.mendeley.com/datasets/ctm7vvpp7n/1), spans multiple continents and income categories, offering a comprehensive view of global trends. Let’s dive into the key components of this study:
- **Digitalization Indicators**  
  The following metrics represent digitalization in this study:  
  - **Fixed Telephone Subscriptions** (per 100 people)  
  - **Mobile Cellular Subscriptions** (per 100 people)  
  - **Broadband Subscriptions** (per 100 people)  
  - **Individuals Using the Internet** (% of population)  
  - **Digitalization Development Level** (composite index derived using PCA)

- **Macroeconomic Control Variables**  
  To capture the broader economic context, the following variables are included:  
  - **Investment**: Gross fixed capital formation (% of GDP)  
  - **Trade Openness**: Sum of imports and exports (% of GDP)  
  - **Labor Force**: Total labor force participation rate  
  - **Inflation**: Consumer price index (%)  
  - **Population**  
  - **Government Consumption**: Expenditure on goods and services (% of GDP)  
  - **R&D Expenditure**

## Technologies Used
- **Python Libraries**:
  - **Pandas**: For data manipulation, cleaning, and handling missing values.
  - **NumPy**: For numerical computations and data transformations.
  - **Matplotlib** and **Seaborn**: For creating static and interactive visualizations 

## Process Overview
### Step 1: Loading the Data  
The first step in any data analysis is to load the dataset into a workable format. For this project, I used **Pandas**, a Python library for data manipulation, to load the data into a DataFrame. A DataFrame is essentially a table that allows us to store and manipulate structured data efficiently. Here’s the code I used:
```python
# Load the dataset
df = pd.read_excel(
    r"C:\Users\nimis\OneDrive\Desktop\NIMISHA\EDA\Data_Analysis_of_the_Effect_of_Digitalization_on_Economic_Growth.xlsx", 
    engine='openpyxl'
)

# Displays the first few rows of the DataFrame
df.head()
```
**Sample Output:**
Here’s what the first few rows of the dataset look like:
![head_output](/images/projects/head_output.png)

### Step 2: Missing Data Check 
After loading the data, the next step is to check for missing values. Missing data can skew analysis and lead to incorrect conclusions, so it’s essential to identify and handle it early. Here’s how I approached this, to identify missing values in the dataset, I used the df.isna().sum() function. This command counts the number of missing values in each column.
```python
df.isna().sum()
```
Here’s the output:
![isna_output](/images/projects/isna_output.png)
**Observations** - 
- Columns like Unnamed: 0 to Unnamed: 4 have a significant number of missing values (e.g., 2726 out of 2730 rows in Unnamed: 0). These columns are likely unnecessary and can be dropped.
- Only one missing value exists in the LCPI: Consumers Price Index column, which can be handled easily.
- Most of the key columns (e.g., FPS, MPS, BBS, IU, LGDP) have no missing values, which is great for our analysis.

### Step 3: Cleaning the Data
After identifying missing values and understanding the dataset’s structure, the next step is to clean the data. Cleaning ensures that the dataset is consistent, readable, and ready for analysis.

**1.Dropping Unnecessary Columns** - The dataset contained several columns that were either entirely empty or irrelevant to the analysis. I dropped these columns to streamline the dataset:
```python
df.drop(columns=['Unnamed: 5', 'Unnamed: 6', 'Unnamed: 2', 'Unnamed: 4', 'INCOME'], inplace=True)
```
**2.Renaming Columns** - Some columns had unclear or inconsistent names. I renamed them to make the dataset more intuitive and easier to work with:
```python
# Renaming columns
df.rename(columns={
    'Unnamed: 0': 'income_category', 
    'Unnamed: 1': 'continent',
    'Unnamed: 3': 'country'
}, inplace=True)
```
To ensure consistency, I also standardized the column names by converting them to lowercase, removing spaces, and stripping special characters:
```python
# Renaming columns for cleaner names
df.columns = df.columns.str.strip().str.replace(' ', '_').str.replace(':', '').str.lower()
```
**3. Handling Missing Values** - The dataset had missing values in the income_category, continent, and country columns. I filled these using the forward fill (ffill) method, which propagates the last valid observation forward:
```python
# Filling missing values in categorical columns
df[['income_category', 'continent', 'country']] = df[['income_category', 'continent', 'country']].fillna(method='ffill')
```
Additionally, there was a single missing value in the lcpi_consumers_price_index column. I filled this with the column’s mean:
```python
# Filling the single missing value in 'lcpi_consumers_price_index'
df['lcpi_consumers_price_index'].fillna(df['lcpi_consumers_price_index'].mean(), inplace=True)
```
After cleaning, the dataset now has a more streamlined and consistent structure. Here’s the updated summary:
```python
df.info()
```
![info_output](/images/projects/info_output.png)

### Step 4: Summary Statistics
After cleaning the data, the next step is to understand its distribution and key characteristics. Summary statistics provide a quick overview of the dataset, helping us identify trends, variability, and potential outliers. Here’s how I approached this:

**1.Calculating Summary Statistics** - I used the describe() function in Pandas to generate summary statistics for all numeric columns in the dataset. This function provides key metrics like mean, standard deviation, minimum, maximum, and percentiles (25%, 50%, 75%). To make the output more readable, I transposed the results using .T:
```python
# Calculating summary statistics
summary_stats = df.describe().T
```
![summary_stat_output](/images/projects/summary_stat_output.png)
**2.Adding the Interquartile Range (IQR)** - The Interquartile Range (IQR) is a useful measure of variability, calculated as the difference between the 75th percentile (Q3) and the 25th percentile (Q1). I added this metric to the summary statistics:
```python
# Calculating IQR
summary_stats['IQR'] = summary_stats['75%'] - summary_stats['25%']

#Displaying key metrics
print(summary_stats[['mean', '50%', 'std', 'IQR']])
```
![iqr_output](/images/projects/iqr_output.png)

### Step 5: Distribution Analysis
Understanding the distribution of variables is crucial for identifying patterns, skewness, and potential outliers in the data. In this step, I analyzed the distribution of key digitalization indicators and control variables using histograms.
Selecting Variables
I divided the variables into two groups:

**Digitalization Indicators:** These include metrics related to digitalization and economic growth.

**Control Variables:** These are macroeconomic factors that provide context for the analysis.

Here’s how I defined the variables:
```python
# Digitalization variables
digitalization_vars = [
    'lgdp', 
    'fps__fixed_phone_subscriptions', 
    'mps_mobile_phone_subscriptions', 
    'bbs_broadband_subscription', 
    'iu_internet_use', 
    'ddi'
]

# Control variables
control_vars = [
    'gfcf_gross_fixed_capital_formation', 
    'to_trade_openness__(expbs+impbs)', 
    'labor_(hlabor+flabor)', 
    'lcpi_consumers_price_index', 
    'lpop_poplulation', 
    'consum_government_consuption', 
    'rd'
]

# Combining all variables
all_vars = digitalization_vars + control_vars
```
**Visualizing Distributions**
To visualize the distributions, I created histograms for the digitalization indicators and GDP. Histograms provide a clear view of how the data is spread across different ranges.
```python
import matplotlib.pyplot as plt

# Histograms for GDP and digitalization indicators
df[digitalization_vars].hist(figsize=(12, 8), bins=20, edgecolor='black')
plt.suptitle('Distribution of Digitalization Indicators and GDP')
plt.show()
```
![distribution_analysis](/images/projects/distribution_analysis.png)
**Observations** -
- **GDP (lgdp):** The distribution is roughly symmetric, with a peak around 8.5 to 9.0. This suggests that most countries in the dataset have a similar level of economic output.
- **Mobile Phone Subscriptions (mps_mobile_phone_subscriptions):** The distribution is right-skewed, with most values clustered between 0.5 and 1.5. A few countries have exceptionally high mobile phone subscription rates, indicating potential outliers.
- **Internet Use (iu_internet_use):** The distribution is slightly right-skewed, with a peak around 0.3 to 0.4. This indicates that internet usage varies significantly across countries, with some having near-universal access.
- **Fixed Phone Subscriptions (fps__fixed_phone_subscriptions):** The distribution is highly right-skewed, with most values close to 0. This reflects the declining relevance of fixed phone lines in many countries.
- **Broadband Subscriptions (bbs_broadband_subscription):** The distribution is right-skewed, with most values below 0.2. A few countries have significantly higher broadband adoption rates.
- **Digital Development Index (ddi):** The distribution is roughly symmetric, centered around 0. This suggests that the index is standardized, with most countries clustered around the mean.

### Step 6: Correlation Analysis
To understand the relationships between digitalization indicators, GDP, and control variables, I performed a correlation analysis. Correlation matrices help identify how variables move together, providing insights into potential dependencies and patterns.

**Calculating the Correlation Matrix** - I calculated the correlation matrix for all variables of interest, including digitalization indicators and control variables:
```python
import seaborn as sns
import matplotlib.pyplot as plt

# Calculate correlation matrix
correlation_matrix = df[digitalization_vars + control_vars].corr()

# Visualize the correlation matrix
plt.figure(figsize=(12, 8))
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', fmt=".2f", linewidths=0.5)
plt.title('Correlation Matrix of Digitalization Indicators, GDP, and Control Variables')
plt.show()
```
The correlation matrix is visualized as a heatmap below:
![correlation_matrix](/images/projects/correlation_matrix.png)
**Observations** - 
- **Internet Use (iu_internet_use)**, **Broadband Subscriptions (bbs_broadband_subscription)**, and **Fixed Phone Subscriptions (fps__fixed_phone_subscriptions)** cluster strongly together, indicating they are closely interrelated. These variables also show strong positive correlations with GDP (lgdp), suggesting that higher digitalization levels are associated with stronger economic performance.
- **R&D Expenditure (rd)** is closely tied to **GDP (lgdp)** (correlation = **0.66**) and **Internet Use (iu_internet_use)**(correlation = **0.56**). This highlights the role of innovation and technological investment in driving economic development.
- Variables like **Labor Force Participation (labor_(hlabor+flabor))** show **negative or negligible correlations** with digitalization indicators and GDP. This suggests that merely increasing labor input does not guarantee higher digital or economic output.
- **Trade Openness (to_trade_openness__(expbs+impbs))** has a moderate positive correlation with **GDP (lgdp)** (correlation = **0.33**) and some digitalization indicators. This indicates that countries with more open economies tend to have higher digitalization levels and stronger economic performance.
- **Population (lpop_poplulation)** and **Inflation (lcpi_consumers_price_index)** show weak or negligible correlations with most variables, suggesting they have limited direct impact on digitalization or GDP in this dataset.