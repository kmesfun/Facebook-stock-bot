#read from companylist.csv and returns a list of all the stock symbols

import csv
import pandas as pd
import numpy as np
df = pd.read_csv('companylist.csv')
lis = []
lis = df['Symbol']
name = df['Name']
stock = [lis,name]
file = open('symbollist.txt','w+')
file2 = open('namelist.txt','w+')
for i in range(len(lis)):
	file.write(lis[i])
for j in range(len(name)):
    file2.write(name[j])

file.close()
file2.close()

