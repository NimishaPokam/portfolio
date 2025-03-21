---
title: "Employee Survey Analysis"
date: 2025-03-14
draft: false
summary: "Analysis of employee engagement survey data using SQL and Tableau."
---

## Overview
This project involves a deep dive into an employee survey dataset from Kaggle, using SQL and Tableau to uncover actionable insights related to work-life balance, stress levels, workload, and sleep habits across various departments and job levels. The goal was to analyze key trends and patterns in the dataset and present them in a visually compelling way.

## Tools & Technologies Used
- **Draw.io**: Used to create the relational schema for the database.  
- **SQL**: Core tool for data extraction and analysis.  
- **Tableau**: Supplementary tool for visualization.  
- **GitHub**: Version control and collaboration platform.

## Process Overview

### Step 1: Dataset Selection and Schema Design
The project began with the selection of a dataset sourced from [Kaggle](https://www.kaggle.com/datasets/lainguyn123/employee-survey/data), which contained responses from an employee survey. This dataset provided information on various aspects of employee work-life balance, stress levels, workload, and sleep habits.

To ensure a clear and efficient database structure, I used [**Draw.io**](https://www.drawio.com/) to create a relational schema. This diagram helped identify the relationships between key entities, such as employee details, job levels, departments, and survey responses.

![Relational Schema](/images/projects/relational_schema.drawio.png)

### Step 2: Database Creation and Data Preparation
After finalizing the schema design, I proceeded to create the tables in **Oracle SQL**. This involved defining the structure of each table, including the necessary fields and their data types. Constraints were applied to ensure data integrity, such as primary keys for unique identification and foreign keys to establish relationships between tables.

Once the tables were created, I [**inserted 20,000 rows of data**](https://github.com/NimishaPokam/employee-survey/blob/main/Insert_Queries/Employee_Survey-%20INSERT%20QUERIES.sql) into the database. This step was crucial for ensuring the dataset was robust and ready for analysis. 

Here’s the SQL code used to create the tables:

```sql
-- Create JobLevel Table
CREATE TABLE JobLevel (
    JobLevelID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    JobLevelType NVARCHAR2(15) NOT NULL
);

-- Create Department Table
CREATE TABLE Department (
    DeptID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    DeptName NVARCHAR2(25) NOT NULL
);

-- Create EmpType Table
CREATE TABLE EmpType (
    EmpTypeID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpTypeName NVARCHAR2(20) NOT NULL
);

-- Create EduLevel Table
CREATE TABLE EduLevel (
    EduLevelID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EduLevelName NVARCHAR2(20) NOT NULL
);

-- Create Commute Table
CREATE TABLE Commute (
    CommuteID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    CommuteMode NVARCHAR2(20) NOT NULL,
    CommuteDistance NUMBER(2) NOT NULL
);

-- Create EmployeeSurvey Table
CREATE TABLE EmployeeSurvey (
    EmployeeSurveyID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    WLB NUMBER(1) NOT NULL,
    WorkEnv NUMBER(1) NOT NULL,
    WorkLoad NUMBER(1) NOT NULL,
    Stress NUMBER(1) NOT NULL,
    JobSatisfaction NUMBER(1) NOT NULL,
    PhysicalActivities NUMBER(5,2) NOT NULL,
    SleepHours NUMBER(4,1) NOT NULL
);

-- Create EmployeeDetails Table
CREATE TABLE EmployeeDetails (
    EmpID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Gender VARCHAR2(6) CHECK (Gender IN ('Male', 'Female', 'Other')) NOT NULL,
    Age NUMBER(2) NOT NULL,
    MaritalStatus NVARCHAR2(20) NOT NULL,
    NumCompanies NUMBER(2) NOT NULL,
    TeamSize NUMBER(2) NOT NULL,
    NumReports NUMBER(2) NOT NULL,
    TrainingHoursPerYear NUMBER(4,2) NOT NULL,
    HaveOT CHAR(5) CHECK (HaveOT IN ('TRUE', 'FALSE')) NOT NULL,
    Experience NUMBER(3) NOT NULL,
    JobLevelID NUMBER,
    DeptID NUMBER,
    EmpTypeID NUMBER,
    EduLevelID NUMBER,
    CommuteID NUMBER,
    EmployeeSurveyID NUMBER,
    CONSTRAINT fk_employeedetails_joblevel_id FOREIGN KEY (JobLevelID) REFERENCES JobLevel(JobLevelID),
    CONSTRAINT fk_employeedetails_dept_id FOREIGN KEY (DeptID) REFERENCES Department(DeptID),
    CONSTRAINT fk_employeedetails_emptype_id FOREIGN KEY (EmpTypeID) REFERENCES EmpType(EmpTypeID),
    CONSTRAINT fk_employeedetails_edulevel_id FOREIGN KEY (EduLevelID) REFERENCES EduLevel(EduLevelID),
    CONSTRAINT fk_employeedetails_commute_id FOREIGN KEY (CommuteID) REFERENCES Commute(CommuteID),
    CONSTRAINT fk_employeedetails_employeesurvey_id FOREIGN KEY (EmployeeSurveyID) REFERENCES EmployeeSurvey(EmployeeSurveyID)
);
```
### Step 3: SQL Analysis
With the database set up, I began writing and executing SQL queries to analyze the data. These queries focused on comparing key metrics, such as workload, employee satisfaction, and sleep patterns, across different departments and job levels.

Here are some of the key analyses I performed:

**1. Identifying Employees with High Workload but High Job Satisfaction** - This query identifies employees who report high workload but also high job satisfaction, which could indicate resilience or effective coping mechanisms.
```sql
SELECT ed.EmpID, 
    j.JobLevelType, 
    d.DeptName, 
    es.Workload, 
    es.JobSatisfaction
FROM EmployeeSurvey es
JOIN EmployeeDetails ed ON ed.employeesurveyid = es.employeesurveyid
JOIN JobLevel j ON ed.joblevelid = j.joblevelid
JOIN Department d ON d.deptid = ed.deptid
WHERE es.Workload >= 4 AND es.JobSatisfaction >= 4;
```
![High Workload High Satisfaction](/images/projects/high_workload_high_satisfaction_output.png)

- Many Senior-level employees reported high workloads but also high job satisfaction, suggesting they thrive in demanding roles.
- Employees in the IT department were prominent in the results, indicating they handle high workloads while staying satisfied and engaged.
- Several Junior employees and Interns/Freshers reported high workloads and satisfaction, reflecting effective onboarding and supportive environments.

**2. Gender Distribution in High Workload Roles** - This query examines whether one gender consistently takes on more demanding jobs.
```sql
SELECT ed.Gender, 
    COUNT(*) AS HighWorkloadEmployees
FROM EmployeeDetails ed
JOIN Employeesurvey es ON ed.employeesurveyid = es.employeesurveyid
WHERE es.Workload = 5
GROUP BY ed.Gender
ORDER BY HighWorkloadEmployees DESC;
```
![Gender Distribution](/images/projects/gender_and_job_demands_analysis.png)

- Male employees make up the majority (284) of those in high-workload roles, suggesting potential gender disparities in workload distribution.
- A significant number of female employees (239) are in high-workload roles, indicating that women are also taking on demanding positions.
- Employees identifying as Other (39) are underrepresented in high-workload roles, highlighting potential inclusivity gaps in high-pressure positions.

**3. Impact of Overtime on Job Satisfaction** - This query identifies the point at which overtime starts negatively affecting job satisfaction.
```sql
SELECT 
    CASE 
        WHEN es.WorkLoad BETWEEN 1 AND 2 THEN 'Low'
        WHEN es.WorkLoad BETWEEN 3 AND 4 THEN 'Moderate'
        WHEN es.WorkLoad > 4 THEN 'High'
    END AS WorkLoadCategory,
    ROUND(AVG(es.JobSatisfaction), 2) AS AvgJobSatisfaction, 
    ROUND(AVG(es.Stress), 2) AS AvgStress,
    COUNT(*) AS EmployeeCount,
    CASE 
        WHEN AVG(es.JobSatisfaction) < 3 THEN 'Low Job Satisfaction'
        WHEN AVG(es.Stress) > 4 THEN 'High Stress'
        ELSE 'Normal'
    END AS Condition
FROM EmployeeSurvey es
JOIN EmployeeDetails ed ON ed.employeesurveyid = es.employeesurveyid
WHERE haveOT = 'TRUE'
GROUP BY 
    CASE 
        WHEN es.WorkLoad BETWEEN 1 AND 2 THEN 'Low'
        WHEN es.WorkLoad BETWEEN 3 AND 4 THEN 'Moderate'
        WHEN es.WorkLoad > 4 THEN 'High'
    END
ORDER BY AvgJobSatisfaction;
```
![Impact of Overtime on Job Distribution](/images/projects/overtime_impact_on_job_satisfaction_and_workload.png)
- Employees with high workloads reported the lowest average job satisfaction (2.58), indicating that excessive overtime negatively impacts morale.
- Even employees with moderate workloads reported low job satisfaction (2.99), suggesting that overtime, even in smaller amounts, can harm employee well-being.
- Employees with low workloads reported the highest job satisfaction (3.46) and normal stress levels, highlighting the importance of balanced workloads.

**4. Identifying Employees Deserving Promotions** - This query highlights employees who might deserve a promotion based on their responsibilities.
```sql
SELECT ed.EmpID, 
    j.JobLevelType, 
    ed.NumReports
FROM EmployeeDetails ed
JOIN JobLevel j ON ed.joblevelid = j.joblevelid
WHERE ed.NumReports >= 0 AND j.JobLevelType NOT IN ('Senior', 'Lead');
```
![Identifying Employees Deserving Promotion](/images/projects/employees_eligible_for_promotion_based_on_responsibilities.png)
- Organizations could consider assigning more responsibilities such as reporting tasks to employees to identify and prepare them for promotions.

**5. Stress Triggers by Department** - This query examines whether workload, commute distance, or lack of physical activity is a major cause of stress in certain departments.
```sql
SELECT d.DeptName, 
    ROUND(AVG(es.Workload),2) AS AvgWorkload, 
    ROUND(AVG(es.Stress),2) AS AvgStress,
    ROUND(AVG(c.CommuteDistance),2) AS AvgCommuteDistance,
    ROUND(AVG(es.PhysicalActivities),2) AS AvgPhysicalActivity
FROM EmployeeSurvey es
JOIN EmployeeDetails ed ON ed.employeesurveyid = es.employeesurveyid
JOIN Department d ON d.deptid = ed.deptid
JOIN Commute c ON c.commuteid = ed.commuteid
GROUP BY d.DeptName;
```
![Stress Triggers by Department](/images/projects/stress_triggers_by_department.png)
- Employees in Marketing and Legal reported higher average workloads (3.10 and 3.01) and stress levels (1.75 and 1.78), likely due to demanding roles and longer commutes.
- HR and Customer Service employees reported lower stress levels (1.76 and 1.69) and workloads (2.79 and 2.86), suggesting better work-life balance in these departments.
- Departments with longer average commute distances (e.g., Legal at 14.30) tended to report slightly higher stress levels, highlighting the impact of commuting on employee well-being.

**6. Sleep Patterns by Department** - This query identifies the department where employees get the most sleep on average.
```sql
SELECT d.DeptName, 
    ROUND(AVG(es.SleepHours),2) AS AvgSleepHours
FROM EmployeeSurvey es
JOIN EmployeeDetails ed ON es.employeesurveyid = ed.employeesurveyid
JOIN Department d ON ed.deptid = d.deptid
GROUP BY d.DeptName
ORDER BY AvgSleepHours DESC;
```
![Sleep Patters by Department](/images/projects/average_sleep_by_department.png)
- Employees in the IT department reported the highest average sleep hours (7.09), suggesting better work-life balance or flexible schedules.
- HR employees had the lowest average sleep hours (6.88), possibly due to higher stress or demanding roles despite lower workloads.
- Most departments reported similar sleep patterns (around 7 hours), indicating that sleep habits are relatively consistent across the organization.

**7. Older Employees in Lower Job Levels** - This query examines whether older employees are stuck in lower job levels.
```sql
SELECT ed.Age, 
    j.JobLevelType, 
    COUNT(*) AS EmployeeCount
FROM EmployeeDetails ed
JOIN Joblevel j ON ed.joblevelid = j.joblevelid
GROUP BY ed.Age, j.jobleveltype
HAVING j.JobLevelType IN ('Junior', 'Intern/Fresher') AND Age > 28;
```
![Older Employees in Lower Job Levels](/images/projects/age_and_job_level_analysis.png)
- Only one employee aged 29 is in a Junior-level role, suggesting potential challenges in career progression for older employees.
**8. Creating Employee Personas** - This query creates personas based on unique clusters of employee attributes.
```sql
SELECT 
    CASE 
        WHEN c.CommuteDistance > 10 AND es.WLB < 3 AND es.Stress > 3 AND es.SleepHours < 7 THEN 'Exhausted Commuter'
        WHEN c.CommuteDistance < 10 AND es.WLB >= 4 AND es.Stress <= 3 THEN 'Balanced Achiever'
        WHEN es.Workload >= 4 AND es.Stress > 4 AND es.JobSatisfaction >= 4 THEN 'Stressed Overachiever'
        ELSE 'Other'
    END AS Persona,
    COUNT(*) AS TotalEmployees
FROM EmployeeSurvey es
JOIN EmployeeDetails ed ON ed.employeesurveyid = es.employeesurveyid
JOIN Commute c ON c.commuteid = ed.commuteid
GROUP BY 
    CASE 
        WHEN c.CommuteDistance > 10 AND es.WLB < 3 AND es.Stress > 3 AND es.SleepHours < 7 THEN 'Exhausted Commuter'
        WHEN c.CommuteDistance < 10 AND es.WLB >= 4 AND es.Stress <= 3 THEN 'Balanced Achiever'
        WHEN es.Workload >= 4 AND es.Stress > 4 AND es.JobSatisfaction >= 4 THEN 'Stressed Overachiever'
        ELSE 'Other'
    END
ORDER BY TotalEmployees DESC;
```
![Creating Employee Personas](/images/projects/employee_personas_based_on_attributes.png)
- The Balanced Achiever persona (459 employees) represents employees with good work-life balance and low stress, indicating a healthy work environment for many.
- The Exhausted Commuter persona (24 employees) highlights a small group struggling with long commutes, high stress, and poor work-life balance.
- The Stressed Overachiever persona (5 employees) is the smallest group, representing employees with high workloads, stress, and satisfaction, suggesting they thrive under pressure but are at risk of burnout.

**9. Employees with the Most Extreme Work-Life Imbalance** - This query identifies employees with extreme work-life imbalances, focusing on high stress, long commutes, and poor sleep.
```sql
SELECT 
    ed.EmpID,
    j.JobLevelType,
    c.CommuteDistance,
    es.Workload,
    es.Stress,
    es.WLB,
    es.SleepHours
FROM EmployeeSurvey es
JOIN EmployeeDetails ed ON ed.employeesurveyid = es.employeesurveyid
JOIN Commute c ON ed.commuteid = c.commuteid
JOIN JobLevel j  ON j.joblevelid = ed.joblevelid
WHERE (es.Stress BETWEEN 3 AND 5 OR es.Workload >= 4) 
    AND es.WLB <= 3 AND es.SleepHours < 6 
    AND c.CommuteDistance > 15
ORDER BY es.Stress DESC, es.WLB ASC;
```
![Employees with the most extreme work-life imbalance](/images/projects/employees_with_extreme_work_life_imbalance.png)
- Employees with extreme work-life imbalances often face high stress levels (3-4) and long commutes (over 15 miles), exacerbating their challenges.
- Junior employees and Interns/Freshers are prominently represented, suggesting that early-career roles may lack support for work-life balance.
- Most employees in this group report low sleep hours (below 6 hours) and poor work-life balance (WLB ≤ 3), indicating a need for better wellness initiatives.

**10. Workload and Satisfaction by Job Levels and Departments** - This query explores the relationship between workload and job satisfaction across different job levels and departments.
```sql
SELECT 
    d.DeptName,
    j.JobLevelType,
    ROUND(AVG(es.Workload),2) AS AvgWorkload,
    ROUND(AVG(es.JobSatisfaction),2) AS AvgJobSatisfaction,
    COUNT(*) AS TotalEmployees
FROM EmployeeSurvey es
JOIN EmployeeDetails ed ON es.employeesurveyid = ed.employeesurveyid
JOIN Department d ON ed.deptid = d.deptid
JOIN JobLevel j ON j.joblevelid = ed.joblevelid
GROUP BY d.DeptName, j.JobLevelType
HAVING AVG(es.Workload) > 3 AND AVG(es.JobSatisfaction) > 3
ORDER BY AvgJobSatisfaction DESC, AvgWorkload ASC;
```
![Workload and Satisfaction by Job Levels and Department](/images/projects/workload_and_satisfaction_by_job_levels_and_departments.png)
- Senior-level employees in departments like Marketing, Finance, and Legal report higher job satisfaction (3.47–3.52) despite moderate workloads, suggesting they find their roles rewarding.
- Interns/Freshers and Junior employees in IT and Finance report lower satisfaction (3.18–3.35) despite similar workloads, indicating potential struggles with role adaptation or support.
- Marketing Leads report the highest average workload (3.42) but relatively lower satisfaction (3.21), highlighting potential burnout risks in leadership roles.

### Step 4: Insights Visualization
To further enhance the analysis and present the results in a more understandable format, I used Tableau for data visualization of few queries. The visualizations provided a clear way to convey the insights derived from the SQL queries, making it easier to spot trends and patterns.

![Insights Visualization](/images/projects/employee_survey_analysis_dashboard.png)
- Some employees, especially in Finance and Customer Service, report high workload but still maintain decent job satisfaction, suggesting other factors influence satisfaction..
- Mid-level and lead roles tend to experience the highest workload, while interns and juniors have relatively lower but varying job satisfaction across departments.
- HR and Operations employees get the least sleep (~6.88-6.92 hours), potentially indicating higher stress or poor work-life balance, while IT employees get the most (~7.09 hours).
- Workload and job satisfaction patterns differ significantly across Sales, Marketing, and IT, hinting at department-specific challenges in workload distribution and engagement.

## Key Learnings & Takeaway
- This project reinforced the importance of using data to uncover actionable insights, such as identifying stress triggers, workload imbalances, and opportunities for employee growth.
- The analysis highlighted the impact of workload, commute, and sleep on employee well-being, emphasizing the need for organizations to prioritize work-life balance.
- Working with SQL, Tableau, and large datasets taught me the value of adaptability and continuous learning in solving real-world problems.