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

