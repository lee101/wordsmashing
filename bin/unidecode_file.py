#!/usr/bin/python3

'''
usage
python3.4 ./bin/unidecode_file.py static/js/american-english.txt > static/js/american-english.txt

'''

from unidecode import unidecode
import fileinput

for line in fileinput.input():
    print(unidecode(line), end="")
