#!/bin/bash
cd tests
nosetests
cd -
appcfg.py update --secure .

