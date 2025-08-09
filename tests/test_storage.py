import os
from moto import mock_s3
import boto3
from storage import upload_file_to_r2


@mock_s3
def test_upload_file(tmp_path):
    os.environ['R2_ACCESS_KEY_ID'] = 'test'
    os.environ['R2_SECRET_ACCESS_KEY'] = 'test'
    bucket = 'mybucket'
    s3 = boto3.client('s3', region_name='us-east-1')
    s3.create_bucket(Bucket=bucket)
    file_path = tmp_path / 'hello.txt'
    file_path.write_text('hi')
    upload_file_to_r2(str(file_path), bucket, 'hello.txt', endpoint_url=None)
    body = s3.get_object(Bucket=bucket, Key='hello.txt')['Body'].read().decode()
    assert body == 'hi'
