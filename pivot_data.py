import boto3
import zipfile
import pandas as pd


def get_zip_data_from_s3(bucket_name, start_date, end_date, access_key, secret_key):

    s3 = boto3.client('s3', aws_access_key_id=access_key, aws_secret_access_key=secret_key)


    response = s3.list_objects_v2(Bucket=bucket_name)


    files_to_download = []
    for obj in response['Contents']:
        file_date = obj['LastModified'].date()
        if start_date <= file_date <= end_date and obj['Key'].endswith('.zip'):
            files_to_download.append(obj['Key'])

    #  single DataFrame
    dfs = []
    for file_key in files_to_download:
        # Download  zip files
        s3.download_file(bucket_name, file_key, file_key)
        with zipfile.ZipFile(file_key, 'r') as zip_ref:
            zip_ref.extractall('.')

        csv_filename = file_key.replace('.zip', '.csv')
        df = pd.read_csv(csv_filename)
        dfs.append(df)

    combined_df = pd.concat(dfs, ignore_index=True)
    combined_df['decimal_data'] = combined_df['hex_data'].apply(lambda x: int(x, 16))

    print(combined_df)


bucket_name = 'mailpdfbackup'
start_date = pd.to_datetime('2023-06-13').date()
end_date = pd.to_datetime('2023-06-15').date()
access_key = 'AKIA3MWKM5TMF6CMUNUS'
secret_key = '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'

get_zip_data_from_s3(bucket_name, start_date, end_date, access_key, secret_key)
