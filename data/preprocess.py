import hashlib
import pandas as pd
import os.path

TRAFFIC_ACCIDENT_DATA = [
    "https://www.npa.gov.tw/NPAGip/wSite/public/Data/f1551682182614.csv",
    "https://www.npa.gov.tw/NPAGip/wSite/public/Data/f1551682149786.csv"
]
CACHE_PREFIX = "/tmp/"
OUTPUT = "merged_traffic_data.csv"


class CachableDataSource:

    def __init__(self, url):
        self.url = url
        self.cache_filepath = self.__get_cache_filepath(url)
        if os.path.isfile(self.cache_filepath):
            self.__load_cache()
        else:
            self.__load_dataframe()
            self.__save_cache()

    def __load_cache(self):
        self.dataframe = pd.read_pickle(self.cache_filepath)

    def __save_cache(self):
        self.dataframe.to_pickle(self.cache_filepath)

    def __load_dataframe(self):
        self.dataframe = pd.read_csv(self.url)

    @classmethod
    def __get_cache_filepath(cls, url):
        return CACHE_PREFIX + hashlib.md5(url.encode("utf-8")).hexdigest()


def extract_columns(data_source):
    dataframe = data_source.dataframe
    dataframe['death'] = dataframe['死亡受傷人數'].map(
        lambda x: x.split(';')[0][2:] if isinstance(x, str) else 0)
    dataframe['injury'] = dataframe['死亡受傷人數'].map(
        lambda x: x.split(';')[1][2:] if isinstance(x, str) else 0)
    dataframe.rename(columns={u'發生時間':'time'}, inplace=True)
    dataframe.rename(columns={u'經度':'lng'}, inplace=True)
    dataframe.rename(columns={u'緯度':'lat'}, inplace=True)
    dataframe = dataframe[pd.notnull(dataframe['lng'])]
    dataframe = dataframe[pd.notnull(dataframe['lat'])]
    return dataframe[['lat', 'lng', 'death', 'injury', 'time']]


def main():
    data_sources = [CachableDataSource(url) for url in TRAFFIC_ACCIDENT_DATA]
    dataframes = [extract_columns(ds) for ds in data_sources]
    merged_dataframe = dataframes[0]
    for dataframe in dataframes[1:]:
        merged_dataframe = merged_dataframe.append(dataframe)
    merged_dataframe.to_csv(OUTPUT)

if __name__ == '__main__':
    main()
