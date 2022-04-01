# React-Custom-Dynamic-Table
React-Custom-Dynamic-Table is an all in one table component where you can have most used table functionalities like sorting, filtering, pagination.
You can configure the table component by passing necessary values to the component as props.

The following features are available:
1. Display Normal text, link, image in a column
2. Sorting table column (single column sort & multiple column sort)
3. Filtering the table column (single column filter & multiple column filter)
    
    3.1. filter by text search
    
    3.2. filter by dropdown
    
    3.3. filter by date
4. Pagination
5. Table column selector (Show/ Hide table columns)
6. Reorder table columns
7. Select multiple rows or select all rows of a page
8. Choose a particular row
9. Modify the table design as your need
10. Hide filter, reorder column, table column selector options if not needed
11. Positioning reorder column & table column selector options, pagination option according to the table.

### Required Configuration

**visibleColumns**

Type: array of string

Description- Columns to display by default. value should be header texts

Example-

```
visibleColumns: [
  "User Name",
  "Email",
  "User Id",
  "Status",
  "Joining Date",
  "Photo"
]
```

**uniqueRowKey**

Type: string

Description- this value is used to identify each row with a unique identifier. key present within the table data.

Example- 

```
uniqueRowKey: "id"
```

**skip**

Type: number

Description- this value is used for pagination. Default initial value should be 0.

Example- 

```
skip: 0
```

**limit**

Type: number

Description- this value is used for pagination. Number of items to be displayed in each page.

Example- 

```
limit: 5 // 5 rows will be displayed in each page of the table
```
### Optional Configuration

**multiSort**

Type: boolean

Description- Default value is false. If you want multiple column sorting option then make it as true.

**Note**: multisort: true option is only available if pagination, filtering, sorting are being handled from server side, not from UI (if allData: false). If you use allData: true, then sort with single column will be applied only.

Example- 

```
multiSort: false
```
**filter**

Type: boolean

Description- Default value is false. If you want filter column option then make it as true.

**Note**: filter with multiple column is only available if pagination, filtering, sorting are being handled from server side, not from UI (if allData: false). If you use allData: true, then filter with single column will be applied only.

Example- 

```
filter: true
```

**pagination**

Type: boolean

Description- Default value is false. If you want pagination option then make it as true.

Example- 

```
pagination: true
```

**multipleSelectable**

Type: boolean

Description- Default value is false. If you want select row option & select all rows within a page (to display a checkbox button in the 1st column), then make it as true.

Example- 

```
multipleSelectable: false
```

**radioSelectable**

Type: boolean

Description- Default value is false. If you want choose a row option (to display a radio button in the 1st column), then make it as true.

Example- 

```
radioSelectable: false
```

**Note**: Please do not use both radioSelectable and multipleSelectable as true.

**allData**

Type: boolean

Description- Default value is false. If you want to handle filtering, sorting, pagination of the table data from the UI only (don't want to call API for the functionalities) then make it as true.

**Note**: If you use allData: true, then filter & sort with single column will be applied only. sort with multiple column (multisort: true) & filter with multiple column will not work.

Example- 

```
allData: false
```

**showHideColumn**

Type: boolean

Description- Default value is false. If you want to display the column selector dropdown by which you can show/ hide a column according to your need, then you can set it as true.

Example- 

```
showHideColumn: true
```

**reOrderColumn**

Type: boolean

Description- Default value is false. If you want to display the reorder column link by which you can change the order of a column according to your need, then you can set it as true.

Example- 

```
reOrderColumn: true
```

**reOrderText**

Type: string

Description- Default value is "Change column order". If you want to change the default text of the reorder column link then send the text as value.

Example- 

```
reOrderText: "Reorder Column"
```

**noDataMessage**

Type: string

Description- Default value is "No Data Found!". If you want to change the default text of the no table data available (when the table data is empty), then send the text as value.

Example- 

```
noDataMessage: "No Data"
```

**columnSelectorPosition**

Type: string

Description- Default value is "top-right". If you want to change the position of the column selector & reorder column, then send the position accordingly (top-left/bottom-left/bottom-right/top-right). It will be displayed in that position according to the table.

Example- 

```
columnSelectorPosition: "top-left"
```

**paginationPosition**

Type: string

Description- Default value is "top-right". If you want to change the position of the pagination option, then send the position accordingly (top-left/bottom-left/bottom-right/top-right). It will be displayed in that position according to the table.

Example- 

```
paginationPosition: "top-left"
```

You can use the below configuration object to display the table according to your need.
```
const initialTableConfig = {
  visibleColumns: [
    "User Name",
    "Email",
    "User Id",
    "Status",
    "Joining Date",
    "Photo"
  ], // to display the default column header values
  skip: 0, // always set it to 0
  limit: 3, // to display the number of rows in a page in the table
  multiSort: false, // if multisort is applicable (only for API data handled)
  filter: true, // if filters needs to be displayed
  pagination: true, // if pagination needs to be displayed
  multipleSelectable: false, // if select multiple rows option present
  radioSelectable: true, // if choose single row option present 
  uniqueRowKey: "id", // unique identifier key (key present in the table data) for the table rows
  allData: false, // if you want filter, pagination, sort handled from UI only then pass it as true (Note: single sort & single column filter is available for allData: true)
  showHideColumn: true, // if column selector needed
  reOrderColumn: true, // if reorder column option needed
  reOrderText: "Reorder column", // text to display to the reorder column section
  noDataMessage: "No result available", // if no data available to display in the table
  columnSelectorPosition: "top-right", // set the position of the column selector around the table, possible opions: top-right, top-left, bottom-right, bottom-left
  paginationPosition: "bottom-right", // set the position of the pagination around the table, possible opions: top-right, top-left, bottom-right, bottom-left
  headerFormat: {
    profileImage: {
      head: "Photo",
      key: "profileImage",
      image: true,
      altImageText: "profile"
    }, // configuation for image type data
    userId: {
      head: "User Id",
      key: "userId",
      isLink: true,
      linkTo: "/users/details", // path where to navigate once clicked on the link - query or param will be concatenated after this (only param or query can be sent, not both) 
      query: ["id", "userId"], // send this if you want multiple query params to send in the url - these are the keys of the table data for which query params will be displayed
      queryTextToDisplay: ["userId", "customerId"], // send this if you want multiple query params to send in the url - these are the texts which will be displayed in the url
      sort: true,
      option: [
        {
          type: "DESC",
          isActive: false
        },
        {
          type: "ASC",
          isActive: false
        }
      ],
      // param: "id", // send this if you want single param to send in the url - this is the key of the table data for which param will be displayed
      // param: ["id", "userId"], // send this if you want multiple params to send in the url - these are the keys of the table data for which params will be displayed
      // query: "id", // send this if you want single query param to send in the url - this is the key of the table data for which query param will be displayed
      // queryTextToDisplay: "userId" // send this if you want single query param to send in the url - this text wiil be displayed in the url
    }, // configuartion for linked text type data, you can send query or param with the data (not both at this moment), 
    // sort option is also available, you have to send option array as displayed for the sorting functionality
    "personalInfo.fullName": {
      head: "User Name",
      key: ["personalInfo", "fullName"],
      populate: true,
      sort: true,
      option: [
        {
          type: "DESC",
          isActive: false
        },
        {
          type: "ASC",
          isActive: false
        }
      ],
      filterObject: {
        type: "TEXT",
        placeholder: "Enter Name",
        value: ""
      }
    }, // configuaration for normal text with the key wrapped within an object (only a single object wrapper), for this you have to pass populate as true, also filter with text input is available
    "personalInfo.email": {
      head: "Email",
      key: ["personalInfo", "email"],
      populate: true,
      sort: true,
      option: [
        {
          type: "DESC",
          isActive: false
        },
        {
          type: "ASC",
          isActive: false
        }
      ],
      filterObject: {
        type: "SELECT",
        list: [{
          key: "-1", // please send the 1st element key as "-1"
          value: "Select Email"
        }, {
          key: "1",
          value: "a@b.com"
        }, {
          key: "2",
          value: "c@b.com"
        }],
        selectedItem: {
          key: "-1",
          value: "Select Email"
        } // default selected item from the list
      }
    }, // configuaration for normal text with the key wrapped within an object (only a single object wrapper), for this you have to pass populate as true, also filter with select dropdown is available
    accountStatus: {
      head: "Status",
      key: "accountStatus"
    },
    createdAt: {
      head: "Joining Date",
      key: "createdAt",
      filterObject: {
        type: "DATE",
        placeholder: "Enter Date (dd/mm/yyyy)",
        value: null, // please send value as null initially
        dateFormat: "dd/MM/yyyy" // please use appropriate date format used in react-datepicker
      }
    } // configuaration for normal text with the key wrapped within an object (only a single object wrapper), for this you have to pass populate as true, also filter with date is available
  }
};
```

