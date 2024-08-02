import React, { useState } from 'react'
import { ScrollView, View, StyleSheet, Text, FlatList } from 'react-native'
import { DataTable, IconButton, Searchbar } from 'react-native-paper'
import { router } from 'expo-router'
import { Picker } from '@react-native-picker/picker'

interface DataTableProps {
  data: any[]
}

const CustomDataTable: React.FC<DataTableProps> = ({ data }) => {
  const [filteredData, setFilteredData] = useState(data)
  const [filter, setFilter] = useState({
    headerIndex: 0,
    query: '',
  })
  const [pagination, setPagination] = useState({
    total: data.length,
    pageSize: 15,
    currentPage: 0,
  })

  const headers = [
    { width: 200, title: 'Created_DT', key: 'created_dt' },
    { width: 200, title: 'Modified_DT', key: 'data_source_modified_dt' },
    { width: 100, title: 'Entity', key: 'entity_type' },
    { width: 150, title: 'Operating status', key: 'operating_status' },
    { width: 250, title: 'Legal name', key: 'legal_name' },
    { width: 200, title: 'DBA name', key: 'dba_name' },
    { width: 250, title: 'Physical address', key: 'physical_address' },
    { width: 150, title: 'Phone', key: 'phone' },
    { width: 100, title: 'DOT', key: 'usdot_number' },
    { width: 100, title: 'MC/MX/FF', key: 'mc_mx_ff_number' },
    { width: 100, title: 'Power units', key: 'power_units' },
    { width: 200, title: 'Out of service date', key: 'out_of_service_date' },
  ]

  const onFilter = (clear?: boolean) => {
    console.log('Filter Started')
    const filtered =
      !filter.query || clear
        ? data
        : data.filter((row) => {
            const columnValue = row[headers[filter.headerIndex].key]
            if (
              columnValue &&
              columnValue
                .toString()
                .toLowerCase()
                .includes(filter.query.toLowerCase())
            ) {
              return true
            }
            return false
          })

    setFilteredData(filtered)
    setPagination({
      ...pagination,
      currentPage: 0,
      total: filtered.length,
    })
    console.log('Filter Ended')
  }

  const renderItem = ({ item: d }: any) => {
    return (
      <DataTable.Row
        key={d.id}
        style={styles.tableRow}
        onPress={() => {
          router.push({
            pathname: '/details',
            params: d,
          })
        }}
      >
        {headers.map((h) => {
          return (
            <DataTable.Cell
              style={{
                width: h.width,
              }}
              key={h.key}
            >
              {d[h.key].replace('"', '')}
            </DataTable.Cell>
          )
        })}
      </DataTable.Row>
    )
  }

  const getPaginationRange = () => {
    const start = pagination.currentPage * pagination.pageSize + 1
    let end = (pagination.currentPage + 1) * pagination.pageSize

    if (end > pagination.total) {
      end = pagination.total
    }
    return { start, end }
  }

  const { start, end } = getPaginationRange()
  const paginationLabel = `${start}-${end} of ${pagination.total}`

  return (
    <ScrollView>
      <View style={styles.filterContainer}>
        <Searchbar
          placeholder='Search'
          onChangeText={(text) => setFilter({ ...filter, query: text })}
          value={filter.query}
          onClearIconPress={() => {
            onFilter(true)
          }}
        />
        <View style={styles.filterFooter}>
          <View style={styles.dropDown}>
            <Text>Filter By</Text>
            <Picker
              selectedValue={filter.headerIndex}
              onValueChange={(headerIndex) =>
                setFilter({ ...filter, headerIndex })
              }
              style={{
                flex: 1,
              }}
            >
              {headers.map((h, index) => (
                <Picker.Item label={h.title} value={index} key={index} />
              ))}
            </Picker>
          </View>

          <IconButton
            icon='magnify'
            mode='outlined'
            onPress={() => onFilter()}
          />
        </View>
      </View>

      <ScrollView horizontal>
        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            {headers.map((h) => {
              return (
                <DataTable.Title
                  key={h.title}
                  style={{
                    width: h.width,
                  }}
                >
                  {h.title}
                </DataTable.Title>
              )
            })}
          </DataTable.Header>
          <FlatList
            data={filteredData.slice(start - 1, end)}
            renderItem={renderItem}
          />
        </DataTable>
      </ScrollView>

      {pagination.total > pagination.pageSize && (
        <DataTable.Pagination
          page={pagination.currentPage}
          numberOfPages={Math.ceil(pagination.total / pagination.pageSize)}
          onPageChange={(currentPage) =>
            setPagination({ ...pagination, currentPage })
          }
          label={paginationLabel}
          numberOfItemsPerPage={pagination.pageSize}
          showFastPaginationControls
          selectPageDropdownLabel={'Rows per page'}
          style={{
            alignSelf: 'center',
          }}
        />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  tableHeader: {
    backgroundColor: '#DCDCDC',
  },
  tableHeaderTitle: {
    width: 200,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },

  filterContainer: {
    padding: 20,
  },
  filterFooter: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  dropDown: {
    flex: 1,
    backgroundColor: '#DCDCDC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 20,
  },
})

export default CustomDataTable
