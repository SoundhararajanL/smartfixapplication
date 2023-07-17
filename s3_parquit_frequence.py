import os
import pandas as pd
from datetime import datetime

# Set the local path where the Parquet files are stored
LOCAL_PATH = '/Users/tamilselvans/Downloads/s3/'

# Initialize a dictionary to store the frequency counts
frequency_counts = {}

# Iterate over each file in the local path
for file_name in os.listdir(LOCAL_PATH):
    if file_name.endswith('.parquet'):
        file_path = os.path.join(LOCAL_PATH, file_name)

        # Load the Parquet file into a DataFrame
        df = pd.read_parquet(file_path)

        # Extract the "resample_timestamp" column and convert it to a datetime type
        df['resample_timestamp'] = pd.to_datetime(df['resample_timestamp'])

        # Calculate the frequency counts for each date
        date_counts = df['resample_timestamp'].dt.date.value_counts()

        # Store the frequency counts in the dictionary with the file name as the key
        frequency_counts[file_name] = date_counts

# Create a DataFrame from the frequency counts dictionary
df_counts = pd.DataFrame(frequency_counts)

# Transpose the DataFrame to have file names as rows and dates as columns
df_counts = df_counts.transpose()

# Fill missing values with zeros
df_counts = df_counts.fillna(0)

# Convert the DataFrame to a CSV file
output_path = 'parquet_count.csv'
df_counts.to_csv(output_path)

print(f"Frequency counts saved to: {output_path}")
