#read from companylist.csv and returns a list of all the stock symbols

import csv
import pandas as pd
import numpy as np
df = pd.read_csv('companylist.csv')
lis = []
lis = df['Symbol']
name = df['Name']
stock = [lis,name]
print stock



