#!/bin/sh
gcloud auth login
gsutil acl get gs://bigbackup

gsutil acl ch -u -R wordsmashing@appspot.gserviceaccount.com:WRITE gs://bigbackup
