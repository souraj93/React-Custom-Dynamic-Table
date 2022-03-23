import { useState } from 'react';
import './App.css';
import CustomDynamicTable from "./CustomDynamicTable";
import { initialTableData } from './constant';

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
  allData: true, // if filter, pagination, sort handled from UI
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
      linkTo: "/web/admin/auth/riders/details",
      query: ["id", "userId"],
      queryTextToDisplay: ["userId", "customerId"],
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
      // param: "id",
      // param: ["id", "userId"],
      // query: "id",
      // queryTextToDisplay: "userId"
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

const App = () => {
  const [tableConfig, updateTableConfig] = useState({ ...initialTableConfig });
  const [tableData, updateTableData] = useState([...initialTableData]);

  const filterByText = (searchText, key) => {
    console.log("filterByText ", searchText, key);
  };

  const filterBySelection = (searchText, key) => {
    console.log("filterBySelection ", searchText, key);
  };

  const filterByDate = (selectedDate, key) => {
    console.log("filterByDate ", selectedDate, key);
  };

  const sortData = (sortedHeaderObj, sortType) => {
    console.log("sort ---------> ", sortedHeaderObj, sortType);
  };

  const handlePageChange = (selectedPageNumber) => {
    console.log("handlePageChange ", selectedPageNumber);
  };

  const handleMultipleRowSelect = (clickedRowItem, clickedIndex, updatedDataArray) => {
    console.log("handleMultipleRowSelect ", clickedRowItem, clickedIndex, updatedDataArray);
  };

  const selectUnselectAllRow = (allRowSelected) => {
    console.log("selectUnselectAllRow ", allRowSelected);
  };

  return (
    <div className="App">
      <CustomDynamicTable
        tableConfig={tableConfig} // table configuration object
        updateTableConfig={updateTableConfig} // function to update the table configuration
        tableData={[...tableData]} // table data (array of objects)
        sortData={sortData} // function to get the table column header object by which the table will be sorted and the sort type (ASC/DESC)
        filterByText={filterByText} // function to get the typed text by which the table to be filtered and the key of the table column header
        filterBySelection={filterBySelection} // function to get the selected value by which the table to be filtered and the key of the table column header
        filterByDate={filterByDate} // function to get the selected date by which the table to be filtered and the key of the table column header
        handlePageChange={handlePageChange} // function to get the current page number of the table
        handleMultipleRowSelect={handleMultipleRowSelect} // function to get the selected/ unselected row details
        updateTableData={updateTableData} // function to update the table data
        selectUnselectAllRow={selectUnselectAllRow} // function to get the selected/ unselected row details
        allData={[...initialTableData]} // this props is used to always have the full data of the table which will not be filtered
        paginationCurrentPage={1} // props to send the current page number to be selected
      />
    </div>
  );
};

export default App;
