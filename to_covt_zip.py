import os
import pandas as pd
import zipfile
# current csv files path

path = '.'

# geting list of csv file
csv_files = [file for file in os.listdir(path) if file.endswith('.csv')] # path having list of files it should get only endwith '.csv' files

# processing  each files
for csv_file in csv_files:
    
    df = pd.read_csv(os.path.join(path, csv_file)) # reading csv file

    
    def hex_to_int(x): # convt hext to decimal
        a = int(x, 16)
        return a // 1000000000000000

    df['decimal_data'] = df['hex_data'].apply(hex_to_int)

    # pivot  table
    pivot_table = df.pivot(index='timestamp', columns='arbitration_id', values='decimal_data')
    pivot_table.index = pd.to_datetime(pivot_table.index)
    re_pivot = pivot_table.resample('1s').max()  # or min()


    # compress into  zip
    output_filename = os.path.splitext(csv_file)[0] + '.zip'
    output_path = os.path.join(path, output_filename)

    with zipfile.ZipFile(output_path, 'w') as zf:
        # adding dataframe
        zf.writestr(csv_file[:-4] + '.txt', re_pivot.to_csv()) # extracts the filename without the extension , '.txt' extension, The content of this file is the processed data in csv format

    # removeing old csv which are in path
    os.remove(os.path.join(path, csv_file))
