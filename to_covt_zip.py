import os
import pandas as pd
import zipfile

path = '/Users/tamilselvans/powerbi/datefolder'

# get a list of csv files i
csv_files = [file for file in os.listdir(path) if file.endswith('.csv')]

# process each CSV file
for csv_file in csv_files:
    # read thefile
    df = pd.read_csv(os.path.join(path, csv_file))

    # convert hex to decimal
    def hex_to_int(x):
        a = int(x, 16)
        return a // 1000000000000000

    df['decimal_data'] = df['hex_data'].apply(hex_to_int)

    # pivot table
    pivot_table = df.pivot(index='timestamp', columns='arbitration_id', values='decimal_data')
    pivot_table.index = pd.to_datetime(pivot_table.index)
    re_pivot = pivot_table.resample('1s').max()  # or min() or other

    # compress into a zip file with csv extension
    output_filename = os.path.splitext(csv_file)[0] + '.zip'
    output_path = os.path.join(path, output_filename)

    with zipfile.ZipFile(output_path, 'w') as zf:
        # add dataFrame to the zip file as a csv
        zf.writestr(csv_file[:-4] + '.csv', re_pivot.to_csv(index=True))

    # Remove the old csv file
    os.remove(os.path.join(path, csv_file))

# get a list of csv files in the specified path after processing
csv_files_after_processing = [file for file in os.listdir(path) if file.endswith('.csv')]

for csv_file in csv_files_after_processing:

    with zipfile.ZipFile(os.path.join(path, csv_file), 'r') as zf:
        zf.extractall(path)

    os.remove(os.path.join(path, csv_file))
