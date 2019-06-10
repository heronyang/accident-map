INPUT = "merged_traffic_data.csv"
OUTPUT = "merged_traffic_data_for_fusion.csv"

with open(INPUT) as fin:
    with open(OUTPUT, 'w') as fout:
        is_first_line = True
        for line in fin:
            if is_first_line:
                fout.write(',location,death,injury,time\n')
                is_first_line = False
                continue
            s = line.split(',')
            s[1] = '"' + s[1]
            s[2] = s[2] + '"'
            fout.write(','.join(s))
print('Done')
