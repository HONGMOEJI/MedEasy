import React, {useState, useEffect} from 'react';
import {
  FlatList,
  TouchableOpacity,
  Modal,
  View,
  Text,
} from 'react-native';
import styled from 'styled-components/native';
import {themes} from './../../styles';
import {Footer, Tag, Button} from './../../components';
import {HeaderIcons, OtherIcons} from '../../../assets/icons';
import FontSizes from '../../../assets/fonts/fontSizes';

const {chevron: ChevronIcon} = HeaderIcons;
const {chevronDown: ChevronDownIcon, delete: Delete} = OtherIcons;

const SearchMedicineResultsScreen = ({route, navigation}) => {
  const {searchQuery} = route.params; // MedicineSearchScreen에서 전달된 검색어
  const [searchResults, setSearchResults] = useState([]);

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSplits, setSelectedSplits] = useState([]);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    color: [],
    shape: [],
    size: [],
    split: []
  });

  useEffect(() => {
    // 임시 데이터
    const dummyData = [
      {
        id: '1',
        item_name: '지엘타이밍정(카페인무수물)',
        item_image:
          'https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/1NAT_bwbZd9',
        entp_name: '지엘파마(주)',
        etc_otc_name: '일반의약품',
        class_name: '각성제',
      },
      {
        id: '2',
        item_name: '베스타제당의정',
        item_image:
          'https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/1MoApPycZgS',
        entp_name: '동야제약(주)',
        etc_otc_name: '일반의약품',
        class_name: '건위소화제',
      },
      {
        id: '3',
        item_name: '아네모정',
        item_image:
          'https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/152035092098000085',
        entp_name: '삼진제약(주)',
        etc_otc_name: '일반의약품',
        class_name: '제산제',
      },
      {
        id: '4',
        item_name: '에바치온캡슐',
        item_image:
          'https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/151577167067000087',
        entp_name: '조아제약(주)',
        etc_otc_name: '일반의약품',
        class_name: '해독제',
      },
      {
        id: '5',
        item_name: '삐콤정',
        item_image:
          'https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/153495248483300010',
        entp_name: '(주)유한양행',
        etc_otc_name: '일반의약품',
        class_name: '혼합비타민제',
      },
      {
        id: '6',
        item_name: '게루삼정',
        item_image:
          'https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/154307400984500104',
        entp_name: '삼남제약(주)',
        etc_otc_name: '일반의약품',
        class_name: '제산제',
      },
      {
        id: '7',
        item_name: '페니라민정(클로르페니라민)',
        item_image:
          'https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/1Orz9gcUHnw',
        entp_name: '지엘파마(주)',
        etc_otc_name: '일반의약품',
        class_name: '항히스타민제',
      },
    ];
    setSearchResults(dummyData);
  }, [searchQuery]);

  // 필터 옵션들
  const filterOptions = {
    color: ['하양', '노랑', '주황', '분홍', '빨강', '갈색', '초록', '청록', '파랑', '남색', '자주', '보라', '회색', '검정', '투명'],
    shape: ['원형', '타원형', '장방형', '삼각형', '사각형', '마름모형', '오각형', '육각형', '팔각형', '반원형', '기타'],
    size: ['소형', '중형', '대형'],
    split: ['없음', '(+)형', '(-)형']
  };

  // 색상 코드 매핑 (약 색상 - 필터 옵션)
  const colorCodes = {
    '하양': '#FFFFFF',
    '노랑': 'rgba(255, 221, 0, 1)',
    '주황': '#FFA500',
    '분홍': '#FFC0CB',
    '빨강': '#FF0000',
    '갈색': '#8B4513',
    '초록': '#008000',
    '청록': '#00CED1',
    '파랑': '#0000FF',
    '남색': '#000080',
    '자주': '#800080',
    '보라': '#9370DB',
    '회색': '#808080',
    '검정': '#000000',
    '투명': 'transparent'
  };  

  const shapeCodes = {
  };

  const openFilterModal = () => {
    // 현재 선택된 필터들로 임시 상태 초기화
    setTempFilters({
      color: [...selectedColors],
      shape: [...selectedShapes],
      size: [...selectedSizes],
      split: [...selectedSplits]
    });
    setFilterModalVisible(true);
  };

  const applyFilters = () => {
    // 임시 상태에서 실제 필터 상태로 적용
    setSelectedColors(tempFilters.color);
    setSelectedShapes(tempFilters.shape);
    setSelectedSizes(tempFilters.size);
    setSelectedSplits(tempFilters.split);
    setFilterModalVisible(false);
  };

  const handleFilterChange = (type, value) => {
    setTempFilters(prev => {
      const currentValues = [...prev[type]];
      const valueIndex = currentValues.indexOf(value);
      
      // 값이 이미 있으면 제거, 없으면 추가
      if (valueIndex !== -1) {
        currentValues.splice(valueIndex, 1);
      } else {
        currentValues.push(value);
      }
      
      return {
        ...prev,
        [type]: currentValues
      };
    });
  };

  const getFilterButtonText = (type, selectedItems) => {
    if (selectedItems.length === 0) {
      // 선택된 항목이 없을 때
      return type === 'color' ? '색상' : 
             type === 'shape' ? '모양' :
             type === 'size' ? '크기' : '분할선';
    } else if (selectedItems.length === 1) {
      // 하나만 선택되었을 때
      return selectedItems[0];
    } else {
      // 여러 개 선택되었을 때
      return `${selectedItems[0]} 외 ${selectedItems.length - 1}건`;
    }
  };

  // 필터 버튼 아이콘 렌더링
  const renderFilterButtonIcon = (type, selectedItems) => {
    if (selectedItems.length === 0) return null;
    
    const firstItem = selectedItems[0];
    
    if (type === 'color') {
      return (
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: colorCodes[firstItem],
            borderWidth: 1.5,
            borderColor: themes.light.borderColor.borderCircle,
            marginRight: 7,
          }}
        />
      );
    } else if (type === 'shape') {
      return (
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            borderWidth: 1.5,
            borderColor: themes.light.textColor.Primary50,
            marginRight: 7,
          }}
        />
      );
    }
    
    return null;
  };

  const clearFilter = (type) => {
    if (type === 'color') {
      setSelectedColors([]);
    } else if (type === 'shape') {
      setSelectedShapes([]);
    } else if (type === 'size') {
      setSelectedSizes([]);
    } else if (type === 'split') {
      setSelectedSplits([]);
    }
  };

  const renderFilterSection = (title, type, options) => (
    <View>
      <Text style={{ 
        fontFamily: 'Pretendard-Bold', 
        fontSize: FontSizes.heading.default, 
        marginBottom: 15,
        color: themes.light.textColor.textPrimary,
      }}>{title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 10,
              gap: 10,
              borderRadius: 5,
              backgroundColor: tempFilters[type].includes(option) ? 
                              themes.light.pointColor.Primary : themes.light.boxColor.inputPrimary,
            }}
            onPress={() => handleFilterChange(type, option)}>

            {type === 'color' && (
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: colorCodes[option],
                  borderWidth: 1.5,
                  borderColor: themes.light.borderColor.borderCircle,
                }}
              />
            )}
            {type === 'shape' && (
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  borderWidth: 1.5,
                  borderColor: themes.light.textColor.Primary50,
                }}
              />
            )}
            <Text
              style={{
                color: tempFilters[type].includes(option) ? 
                      themes.light.textColor.buttonText : themes.light.textColor.Primary50,
                fontFamily: 'Pretendard-SemiBold',
              }}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // 통합 필터 모달
  const renderIntegratedFilterModal = () => (
    <Modal
      visible={filterModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setFilterModalVisible(false)}>
      <View style={{ 
        flex: 1, 
        justifyContent: 'flex-end', 
        backgroundColor: themes.light.bgColor.modalBG,
      }}>
        <View style={{ 
          backgroundColor: themes.light.bgColor.bgPrimary, 
          borderTopLeftRadius: 40, 
          borderTopRightRadius: 40,
          paddingTop: 10,
          paddingBottom: 40,
        }}>
          <View style={{alignItems: 'center', marginBottom: 25}}>
            <View style={{
              width: 40,
              height: 5,
              borderRadius: 4,
              backgroundColor: themes.light.boxColor.modalBar,
            }}/>
          </View>

          <View style={{ 
            paddingHorizontal: 20,
            gap: 30,
            alignItems: 'center'
          }}>
            <Text style={{ 
              fontSize: FontSizes.title.default, 
              fontFamily: 'KimjungchulGothic-Bold',
              color: themes.light.textColor.textPrimary,
            }}>특징 검색</Text>
          
            <View style={{gap: 30}}>
              {renderFilterSection('색상', 'color', filterOptions.color)}
              {renderFilterSection('모양', 'shape', filterOptions.shape)}
              {renderFilterSection('크기', 'size', filterOptions.size)}
              {renderFilterSection('분할선', 'split', filterOptions.split)}
            </View>
            <Button title='적용하기' onPress={applyFilters} />
          </View>
        </View>
      </View>
    </Modal>
  );

  const handleSearchBarPress = () => {
    navigation.navigate('SearchMedicine');
  };

  // 임시로 id 값 넘김
  const handleSearchResultPress = medicineId => {
    navigation.navigate('MedicineDetail', {id: medicineId});
  };

  return (
    <Container>
      <HeaderContainer>
        <ChevronAndSearchContainer>
          <ChevronIconButton onPress={() => navigation.goBack()}>
            <ChevronIcon
              height={17}
              width={17}
              style={{color: themes.light.textColor.textPrimary}}
            />
          </ChevronIconButton>
          <SearchBarTouchable onPress={handleSearchBarPress}>
            <SearchQueryText>{searchQuery}</SearchQueryText>
            <SearchIconContainer>
              <OtherIcons.search
                width={17.5}
                height={17.5}
                style={{color: themes.light.textColor.Primary20}}
              />
            </SearchIconContainer>
          </SearchBarTouchable>
        </ChevronAndSearchContainer>

        {searchResults.length > 0 && (
        <FeatureSearchContainer>
          <FeatureSearchText>특징 검색</FeatureSearchText>
          <ScrollableFilterContainer
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <FilterButton 
              onPress={openFilterModal}
              selected={selectedColors.length > 0}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {renderFilterButtonIcon('color', selectedColors)}
                <FilterButtonText selected={selectedColors.length > 0}>
                  {getFilterButtonText('color', selectedColors)}
                </FilterButtonText>
              </View>
              {selectedColors.length > 0 ? (
                <TouchableOpacity onPress={() => clearFilter('color')}>
                  <Delete
                    width={10} 
                    height={10}
                    style={{ color: themes.light.textColor.Primary30 }}
                  />
                </TouchableOpacity>
              ) : (
                <ChevronDownIcon
                  style={{ color: themes.light.textColor.Primary30 }}
                />
              )}
            </FilterButton>

            <FilterButton 
              onPress={openFilterModal}
              selected={selectedShapes.length > 0}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {renderFilterButtonIcon('shape', selectedShapes)}
                <FilterButtonText selected={selectedShapes.length > 0}>
                  {getFilterButtonText('shape', selectedShapes)}
                </FilterButtonText>
              </View>
              {selectedShapes.length > 0 ? (
                <TouchableOpacity onPress={() => clearFilter('shape')}>
                  <Delete
                    width={10} 
                    height={10}
                    style={{ color: themes.light.textColor.Primary30 }}
                  />
                </TouchableOpacity>
              ) : (
                <ChevronDownIcon
                  style={{ color: themes.light.textColor.Primary30 }}
                />
              )}
            </FilterButton>

            <FilterButton 
              onPress={openFilterModal}
              selected={selectedSizes.length > 0}>
              <FilterButtonText selected={selectedSizes.length > 0}>
                {getFilterButtonText('size', selectedSizes)}
              </FilterButtonText>
              {selectedSizes.length > 0 ? (
                <TouchableOpacity onPress={() => clearFilter('size')}>
                  <Delete
                    width={10} 
                    height={10}
                    style={{ color: themes.light.textColor.Primary30 }}
                  />
                </TouchableOpacity>
              ) : (
                <ChevronDownIcon
                  style={{ color: themes.light.textColor.Primary30 }}
                />
              )}
            </FilterButton>

            <FilterButton 
              onPress={openFilterModal}
              selected={selectedSplits.length > 0}>
              <FilterButtonText selected={selectedSplits.length > 0}>
                {getFilterButtonText('split', selectedSplits)}
              </FilterButtonText>
              {selectedSplits.length > 0 ? (
                <TouchableOpacity onPress={() => clearFilter('split')}>
                  <Delete
                    width={10} 
                    height={10}
                    style={{ color: themes.light.textColor.Primary30 }}
                  />
                </TouchableOpacity>
              ) : (
                <ChevronDownIcon
                  style={{ color: themes.light.textColor.Primary30 }}
                />
              )}
            </FilterButton>
          </ScrollableFilterContainer>
        </FeatureSearchContainer>
      )}

      {/* 통합 필터 모달 렌더링 */}
      {renderIntegratedFilterModal()}
      </HeaderContainer>

      <SearchResultContainer>
        {searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <SearchResultItem
                onPress={() => handleSearchResultPress(item.id)}>
                <ImageContainer>
                  <MedicineImage
                    source={{uri: item.item_image}}
                    style={{resizeMode: 'stretch'}}
                  />
                </ImageContainer>

                <InfoContainer>
                  <ManufacturerText>{item.entp_name}</ManufacturerText>
                  <MedicineNameText>{item.item_name}</MedicineNameText>
                  <TypeContainer>
                    <Tag sizeType="small" colorType="resultPrimary">
                      {item.etc_otc_name}
                    </Tag>
                    <Tag sizeType="small" colorType="resultSecondary">
                      {item.class_name}
                    </Tag>
                  </TypeContainer>
                </InfoContainer>
              </SearchResultItem>
            )}
            ListFooterComponent={() => <Footer />}
          />
        ) : (
          <NoResultsContainer>
            <NoResultsText>검색 결과가 없습니다.</NoResultsText>
            <NoResultsSubText>
              검색어를 다시 한 번{'\n'}확인해 주세요.
            </NoResultsSubText>
          </NoResultsContainer>
        )}
      </SearchResultContainer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${themes.light.bgColor.bgPrimary};
`;

const HeaderContainer = styled.View`
  padding-top: 70px;
  padding-bottom: 10px;
  background-color: ${themes.light.bgColor.headerBG};
`;

const ChevronAndSearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-right: 15px;
  padding-left: 12px;
`;

const SearchBarTouchable = styled(TouchableOpacity)`
  height: 44px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  background-color: ${({theme}) => themes.light.boxColor.inputSecondary};
  flex: 1;
  padding: 13px 20px 13px 15px;
`;

const SearchQueryText = styled.Text`
  font-size: 15px;
  font-family: 'Pretendard-SemiBold';
  color: ${themes.light.textColor.textPrimary};
`;

const SearchIconContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const ChevronIconButton = styled(TouchableOpacity)`
  margin-right: 12px;
`;

const SearchResultContainer = styled.View`
  flex: 1;
  margin-top: 10px;
  background-color: ${themes.light.bgColor.bgPrimary};
`;

const SearchResultItem = styled(TouchableOpacity)`
  height: 74.67px;
  flex-direction: row;
  align-items: center;
  margin: 0 15px 25px 15px;
`;

const ImageContainer = styled.View`
  width: 140px;
  height: 74.67px;
  margin-right: 15px;
  border-radius: 10px;
`;

const MedicineImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

const InfoContainer = styled.View`
  height: 100%;
  gap: 7px;
  justify-content: center;
`;

const ManufacturerText = styled.Text`
  font-size: 13px;
  font-family: 'Pretendard-SemiBold';
  color: ${themes.light.textColor.Primary50};
`;

const MedicineNameText = styled.Text`
  font-size: 17px;
  font-family: 'Pretendard-Bold';
  color: ${themes.light.textColor.textPrimary};
`;

const TypeContainer = styled.View`
  flex-direction: row;
  gap: 11px;
`;

const NoResultsContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const NoResultsText = styled.Text`
  font-size: 18px;
  font-family: 'Pretendard-SemiBold';
  color: ${themes.light.textColor.textPrimary};
`;

const NoResultsSubText = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-SemiBold';
  color: ${themes.light.textColor.Primary30};
  margin-top: 18px;
  text-align: center;
`;

const FeatureSearchContainer = styled.View`
  margin-top: 15px;
  padding-left: 20px;
  flex-direction: row;
  align-items: center;
`;

const FeatureSearchText = styled.Text`
  font-size: 15px;
  font-family: 'Pretendard-SemiBold';
  margin-right: 11px;
`;

const ScrollableFilterContainer = styled.ScrollView`
  flex-direction: row;
`;

const FilterButton = styled(TouchableOpacity)`
  border-color: ${props => props.selected ? 
    themes.light.pointColor.primary30 : themes.light.boxColor.inputSecondary};
  flex-direction: row;
  border-width: 1.5px;
  padding: 6px 9px 6px 11px;
  border-radius: 40px;
  margin-right: 10px;
  align-items: center;
  background-color: ${props => props.selected ? 
    themes.light.pointColor.Primary10 : 'transparent'};
`;

const FilterButtonText = styled.Text`
  font-size: ${FontSizes.body.default};
  margin-right: 6px;
  font-family: 'Pretendard-SemiBold';
  color: ${themes.light.textColor.textPrimary};
`;

export default SearchMedicineResultsScreen;