#!/bin/sh
#------------------------------------------------------------------
#-- Param 1 : Namespace
#-- Param 2 : Kind (table id)
#-- Param 3 : Directory in which the csv file should be stored
#-- Param 4 : output file name
#------------------------------------------------------------------
appcfg.py download_data --secure --email=$BACKUP_USERID --        config_file=configClientExtract.yml --filename=$3/$4.csv --kind=$2 --namespace=$1 --passin data <<-EOF $BACKUP_PASSWORD EOF
