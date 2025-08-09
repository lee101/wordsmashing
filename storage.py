import os
import boto3


def upload_file_to_r2(file_path, bucket, key, endpoint_url=None):
    """Upload a file to an R2 bucket using S3 API."""
    session = boto3.session.Session()
    client = session.client(
        's3',
        endpoint_url=endpoint_url or os.getenv('R2_ENDPOINT_URL'),
        aws_access_key_id=os.getenv('R2_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('R2_SECRET_ACCESS_KEY'),
        region_name=os.getenv('R2_REGION', 'us-east-1'),
    )
    client.upload_file(file_path, bucket, key)
