// plugins
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import moment from 'moment';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// components
import ColumnModal from './column-modal';

// images
import sortUpImage from './images/sort-up.svg';
import sortDownImage from './images/sort-down.svg';

// css
import "react-datepicker/dist/react-datepicker.css";
import './custom-dynamic-table.css';

const CustomDynamicTable = (props) => {
  const [visibleColumns, updateVisibleColumns] = useState([]);
  const [displayColumnDropdown, toggleColumnDropdown] = useState(false);
  const [allRowSelected, toggleAllRowSelection] = useState(false);
  const [currentPage, updateCurrentPage] = useState(1);
  const [allData, updateAllData] = useState([]);
  const [detectDataUpdate, toggleDataUpdate] = useState(false);
  const [openColumnModal, toggleColumnModal] = useState(false);

  let dragged;
  let over;
  let placeholder = document.createElement("li");
  placeholder.className = "placeholder";

  const navigate = useNavigate();

  // function to get the value from an object
  const formatWrappedObject = (key, item) => {
    let value = item;
    if (typeof key !== "string") {
      key.forEach(function (each) {
        value = value[each];
      });
    } else {
      value = value[key] || (value[key] !== 0 ? "N/A" : 0);
    }
    return value;
  };

  // function to open link if there is any link present in the table
  const openLink = (localHeaderData, localRowData) => {
    let key = '';
    let finalUrl = localHeaderData.linkTo;
    let isParam = true;
    if (localHeaderData.param?.length) {
      key = localHeaderData.param;
    } else if (localHeaderData.query?.length) {
      key = localHeaderData.query;
      isParam = false;
    }

    if (typeof key !== "string") {
      key.forEach(function (each, index) {
        if (isParam) {
          finalUrl += `/${localRowData[each]}`;
        } else {
          finalUrl += `${!index ? '?' : '&'}${localHeaderData.queryTextToDisplay[index]}=${localRowData[each]}`;
        }
      });
    } else {
      if (isParam) {
        finalUrl += `/${localRowData[key]}`;
      } else {
        finalUrl += `?${localHeaderData.queryTextToDisplay}=${localRowData[key]}`;
      }
    }

    navigate(finalUrl);
  };

  // function to choose column name from the column selector dropdown
  const handleColumnChange = (headerKey) => {
    const localCols = [...visibleColumns];
    if (localCols.includes(props.tableConfig?.headerFormat[headerKey].head)) {
      localCols.splice(localCols.indexOf(props.tableConfig?.headerFormat[headerKey].head), 1);
    } else {
      localCols.push(props.tableConfig?.headerFormat[headerKey].head);
    }
    updateVisibleColumns([...localCols]);
  };

  // function to handle sort if sorting is handled from UI
  const sortData = (key, sortType) => {
    let sortOrder = 1;
    let headerKey = props.tableConfig.headerFormat[key].key;
    if (sortType === "DESC") {
      sortOrder = -1;
    }
    return (a, b) => {
      let result = (formatWrappedObject(headerKey, a) < formatWrappedObject(headerKey, b))
        ? -1 : (formatWrappedObject(headerKey, a) > formatWrappedObject(headerKey, b)) ? 1 : 0;
      return sortOrder * result;
    }
  };

  // function to handle sort functionality
  const sort = (headerVal, sortType) => {
    const localTableConfig = { ...props.tableConfig };
    const wholeHeaderFormatObj = { ...localTableConfig?.headerFormat };
    const selectedHeaderObj = { ...wholeHeaderFormatObj[headerVal] };
    selectedHeaderObj.option.forEach(each => {
      each.isActive = false;
      if (each.type === sortType) {
        each.isActive = true;
      }
    });
    if (!localTableConfig.multiSort) {
      for (let obj in wholeHeaderFormatObj) {
        if (obj !== headerVal) {
          if (wholeHeaderFormatObj[obj].sort) {
            wholeHeaderFormatObj[obj].option?.forEach(each => {
              each.isActive = false;
            });
          }
        }
      }

      if (props.tableConfig?.allData) {
        const localAllData = [...allData];
        localAllData.sort(sortData(headerVal, sortType));
        updateAllData([...localAllData]);
        toggleDataUpdate(true);
      }
    }
    wholeHeaderFormatObj[headerVal] = { ...selectedHeaderObj };
    localTableConfig.headerFormat = { ...wholeHeaderFormatObj };
    props.updateTableConfig({ ...localTableConfig });
    props.sortData({ ...selectedHeaderObj }, sortType);
  };

  // common function to filter all data (if filter is handled from UI)
  const commonFunctionForAllDataFilter = (filterType, searchText, key, selectedHeaderObj) => {
    const localAllData = [...props.allData];
    let filteredAllData = [];
    let isInIf = false;

    if (filterType === "SELECT") {
      if (searchText !== "-1") {
        isInIf = true;
        localAllData.forEach(each => {
          if (formatWrappedObject(props.tableConfig?.headerFormat[key].key, each) === selectedHeaderObj.filterObject.selectedItem.value) {
            filteredAllData.push({ ...each });
          }
        });
      }
    } else if (filterType === "TEXT") {
      if (searchText.trim().length) {
        isInIf = true;
        localAllData.forEach(each => {
          if (new RegExp(searchText, 'i').test(formatWrappedObject(props.tableConfig?.headerFormat[key].key, each))) {
            filteredAllData.push({ ...each });
          }
        });
      }
    } else if (filterType === "DATE") {
      if (searchText !== null || searchText !== "null") {
        isInIf = true;
        localAllData.forEach(each => {
          if (formatWrappedObject(props.tableConfig?.headerFormat[key].key, each) === moment(searchText).format(props.tableConfig?.headerFormat[key].filterObject?.dateFormat.replaceAll('d', 'D'))) {
            filteredAllData.push({ ...each });
          }
        });
      }
    }

    if (!isInIf) {
      const idArr = [];
      allData.forEach(each => {
        if (each.selected) {
          idArr.push(each[props.tableConfig?.uniqueRowKey]);
        }
      });
      localAllData.forEach(each => {
        if (idArr.includes(each[props.tableConfig?.uniqueRowKey])) {
          each.selected = true;
        }
      });
      filteredAllData = [...localAllData];
    }

    updateAllData([...filteredAllData]);

    updateCurrentPage(1);

    toggleDataUpdate(true);

  };

  // function to update the table when the table is filtered with input text
  const filterByText = (searchText, key) => {
    const localTableConfig = { ...props.tableConfig };
    const wholeHeaderFormatObj = { ...localTableConfig?.headerFormat };
    const selectedHeaderObj = { ...wholeHeaderFormatObj[key] };

    selectedHeaderObj.filterObject.value = searchText;

    wholeHeaderFormatObj[key] = { ...selectedHeaderObj };
    localTableConfig.headerFormat = { ...wholeHeaderFormatObj };
    props.updateTableConfig({ ...localTableConfig });

    if (props.tableConfig?.allData) {
      commonFunctionForAllDataFilter("TEXT", searchText, key);
    }
    props.filterByText(searchText, key);
  };

  // function to update the table when the table is filtered with dropdown
  const filterBySelection = (searchText, key) => {
    const localTableConfig = { ...props.tableConfig };
    const wholeHeaderFormatObj = { ...localTableConfig?.headerFormat };
    const selectedHeaderObj = { ...wholeHeaderFormatObj[key] };

    selectedHeaderObj.filterObject.selectedItem = { ...selectedHeaderObj.filterObject?.list.find(each => each.key === searchText) };

    wholeHeaderFormatObj[key] = { ...selectedHeaderObj };
    localTableConfig.headerFormat = { ...wholeHeaderFormatObj };
    props.updateTableConfig({ ...localTableConfig });

    if (props.tableConfig?.allData) {
      commonFunctionForAllDataFilter("SELECT", searchText, key, selectedHeaderObj);
    }

    props.filterBySelection(searchText, key);
  };

  // function to update the table when the table is filtered with date
  const setDateFilter = (date, key) => {
    const localTableConfig = { ...props.tableConfig };
    const wholeHeaderFormatObj = { ...localTableConfig?.headerFormat };
    const selectedHeaderObj = { ...wholeHeaderFormatObj[key] };

    selectedHeaderObj.filterObject.value = date;

    wholeHeaderFormatObj[key] = { ...selectedHeaderObj };
    localTableConfig.headerFormat = { ...wholeHeaderFormatObj };
    props.updateTableConfig({ ...localTableConfig });

    if (props.tableConfig?.allData) {
      commonFunctionForAllDataFilter("DATE", date, key, selectedHeaderObj);
    }

    props.filterByDate(date, key);
  };

  // function to handle page click of the pagination
  const handlePageClick = (page) => {
    updateCurrentPage(page.selected + 1);
    props.handlePageChange(page.selected + 1);
  };

  // function to choose a particular row of the table
  const handleRowSelect = (dataItem, index) => {
    let localData = [];
    if (props.tableConfig?.allData) {
      localData = [...allData];
    } else {
      localData = [...props.tableData];
    }
    if (props.tableConfig?.multipleSelectable) {
      localData.forEach(each => {
        if (each[props.tableConfig?.uniqueRowKey] === dataItem[props.tableConfig?.uniqueRowKey]) {
          each.selected = !each.selected;
        }
      });
      toggleAllRowSelection(false);
    } else {
      localData.forEach(each => {
        if (each[props.tableConfig?.uniqueRowKey] === dataItem[props.tableConfig?.uniqueRowKey]) {
          each.selected = true;
        } else {
          each.selected = false;
        }
      });
    }

    if (props.tableConfig?.allData) {
      updateAllData([...localData]);
    } else {
      props.updateTableData([...localData]);
    }

    props.handleMultipleRowSelect(dataItem, index, [...localData]);
  };

  // function to select all rows of a page
  const selectUnselectAllRow = () => {
    const localData = [...props.tableData];
    localData.forEach(each => {
      each.selected = !allRowSelected ? true : false;
    });
    toggleAllRowSelection(!allRowSelected);
    props.updateTableData([...localData]);
    props.selectUnselectAllRow(!allRowSelected);
  };

  // change the table data whenever update needed
  const changeTableData = () => {
    let localData = [];
    const localTableConfig = { ...props.tableConfig };
    let skip = props.tableConfig?.skip;
    let limit = props.tableConfig?.limit;

    skip = limit * (Number(currentPage - 1));
    limit = limit * Number(currentPage);

    localTableConfig.skip = skip;

    props.updateTableConfig({ ...localTableConfig });

    if (!allData || (allData && !allData.length)) {
      localData = [...props.allData?.slice(skip, limit)];
    } else {
      localData = [...allData?.slice(skip, limit)];
    }

    props.updateTableData([...localData]);
    toggleDataUpdate(false);
  };

  // function to update the table header according to the drag-drop result
  const updateHeaderDataDragDrop = (from, to) => {
    const localTableConfig = { ...props.tableConfig };
    const wholeHeaderFormatObj = { ...localTableConfig?.headerFormat };
    const obj = {};
    const fromKey = Object.keys(wholeHeaderFormatObj)[from];
    const keys = Object.keys(wholeHeaderFormatObj);
    let newKeys = [];

    if (to < from) {
      const beforeTo = keys.slice(0, to);
      const inBetween = keys.slice(to, from);
      let last = [];
      if (keys[from + 1]) {
        last = keys.slice(from + 1);
      }
      newKeys = newKeys.concat([...beforeTo], fromKey, [...inBetween], [...last]);
    } else if (to > from) {
      const beforeFrom = keys.slice(0, from);
      let inBetween = [];
      if (keys[from + 1] && keys[to + 1]) {
        inBetween = keys.slice(from + 1, to + 1);
      }

      let last = [];
      if (keys[to + 1]) {
        last = keys.slice(to + 1);
      }
      newKeys = newKeys.concat([...beforeFrom], [...inBetween], fromKey, [...last]);
    } else {
      newKeys = [...keys];
    }

    newKeys.forEach(each => {
      obj[each] = wholeHeaderFormatObj[each];
    });

    localTableConfig.headerFormat = { ...obj };
    props.updateTableConfig({ ...localTableConfig });
  };

  // function to detect where the drag is going to start
  const dragStart = (e) => {
    dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', dragged);
  };

  // function to detect where the drag is going to end
  const dragEnd = (e) => {
    dragged.style.display = 'block';
    if (dragged.parentNode) {
      dragged.parentNode.removeChild(placeholder);
    }

    // update state
    var from = Number(dragged.dataset.id);
    var to = Number(over.dataset.id);
    if (from < to) to--;

    updateHeaderDataDragDrop(from, to);
  };

  // function to detect the element on which the dragged element is present
  const dragOver = (e) => {
    e.preventDefault();
    dragged.style.display = "none";
    if (e.target.className === 'placeholder') return;

    if (e.target.parentNode && e.target.parentNode.className !== "custom-dynamic-table-wrapper") {
      over = e.target;
      e.target.parentNode.insertBefore(placeholder, e.target);
    }
  };

  // function to display the table data (tbody data)
  const displayTableData = () => {
    let dataArray = [...props.tableData];
    let noDataColLength = visibleColumns.length;
    if (props.tableConfig?.multipleSelectable || props.tableConfig?.radioSelectable) {
      noDataColLength++;
    }

    if (dataArray.length) {
      return dataArray.map((rowData, index) => {
        return <tr key={`row-${index}`} className={`table-row table-row-${index} ${rowData.selected ? 'table-row-selected' : ''}`}>
          {props.tableConfig?.multipleSelectable ?
            <td>
              <Form.Check
                type="checkbox"
                id={`row-select-${index}`}
                checked={rowData.selected}
                onChange={() => handleRowSelect(rowData, index)}
              />
            </td>
            : null}
          {props.tableConfig?.radioSelectable ?
            <td>
              <Form.Check
                type="radio"
                id={`row-radio-${index}`}
                checked={rowData.selected}
                onChange={() => handleRowSelect(rowData, index)}
              />
            </td>
            : null}
          {Object.keys(props.tableConfig?.headerFormat).map((header, ind) => {
            return visibleColumns?.indexOf(
              props.tableConfig?.headerFormat[header]?.head
            ) > -1 ? <td key={`${index}-${ind}`} className={`table-column table-column-${index}-${ind}`}>
              {!props.tableConfig?.headerFormat[header].populate
                ? props.tableConfig?.headerFormat[header].isLink ?
                  <Button variant="link"
                    onClick={() => openLink(props.tableConfig?.headerFormat[header], rowData)}>
                    {rowData[props.tableConfig?.headerFormat[header].key]}
                  </Button>
                  :
                  props.tableConfig?.headerFormat[header].image &&
                    rowData[props.tableConfig?.headerFormat[header].key] ?
                    <img src={rowData[props.tableConfig?.headerFormat[header].key]} alt={props.tableConfig?.headerFormat[header].altImageText} className="only-photo-column" />
                    :
                    <span>
                      {/* if the column is for displaying normal text */}
                      {rowData[props.tableConfig?.headerFormat[header].key]}
                    </span>
                :
                props.tableConfig?.headerFormat[header].isLink ?
                  <span>
                    {/* if the column is for displaying text in wrapped object */}
                    <Button variant="link"
                      onClick={() => openLink(props.tableConfig?.headerFormat[header], rowData)}>
                      {formatWrappedObject(
                        props.tableConfig?.headerFormat[header].key,
                        rowData
                      )}
                    </Button>
                  </span>
                  :
                  <span>
                    {/* if the column is for displaying text in wrapped object */}
                    {formatWrappedObject(
                      props.tableConfig?.headerFormat[header].key,
                      rowData
                    )}
                  </span>

              }
            </td> : null
          })}

        </tr>
      });
    } else {
      return <tr className='no-data-message'>
        <td colSpan={noDataColLength}>{props.tableConfig?.noDataMessage || 'No Data Found!'}</td>
      </tr>;
    }

  };

  // function to display the modal for reordering the columns
  const displayColumnReorderModal = () => {
    const reorderModal = <ColumnModal openColumnModal={openColumnModal}
      toggleColumnModal={toggleColumnModal}
      columns={props?.tableConfig?.headerFormat}
      onDragOver={dragOver}
      onDragEnd={dragEnd}
      onDragStart={dragStart}
    />;

    if (props.tableConfig?.reOrderColumn && openColumnModal) {
      return reorderModal;
    } else {
      return null;
    }
  };

  // function to display the column selector
  const displayColumnSelector = () => {
    const columnSelectorButton = <Button
      variant="primary"
      onClick={() => toggleColumnDropdown(!displayColumnDropdown)}
      className='column-selector-dropdown-button'
    >{visibleColumns.length} column selected
      <img
        src={!displayColumnDropdown ? sortDownImage : sortUpImage}
        alt="dropdown-arrow"
        className='column-selector-dropdown-image'
        style={{
          width: "15px",
          marginLeft: "5px",
          verticalAlign: "inherit"
        }} />
    </Button>;

    const columnSelectorDropdown = <ul className='column-names-list'>
      {Object.keys(props.tableConfig?.headerFormat).map((header, index) => {
        return <li
          key={`column-checkbox-${index}`}
        >
          <Form.Check
            type="checkbox"
            id={`column-checkbox-${index}`}
            label={`${props.tableConfig?.headerFormat[header].head}`}
            checked={visibleColumns.includes(props.tableConfig?.headerFormat[header].head)}
            onChange={() => handleColumnChange(header)}
          />
        </li>
      })}
    </ul>;

    const reorderButton = <>
      <button className='btn btn-link change-column-order-link' onClick={() => toggleColumnModal(true)}>{props.tableConfig?.reOrderText || "Change column order"}</button>
      {displayColumnReorderModal()}
    </>;

    if (props.tableConfig?.showHideColumn || props.tableConfig?.reOrderColumn) {
      return <div className={`column-dropdown-wrapper ${props.tableConfig?.columnSelectorPosition?.includes("left") ? 'float-left text-align-left' : 'float-right text-align-right'}`}>
        {props.tableConfig?.showHideColumn ?
          <>
            {columnSelectorButton}
            {displayColumnDropdown ?
              columnSelectorDropdown
              : null}
          </>
          : null}
        {props.tableConfig?.reOrderColumn ?
          reorderButton
          : null}
      </div>
    }
  };

  // function to display the table
  const displayTable = () => {
    return visibleColumns?.length ? <Table striped bordered hover style={{ position: "relative" }}>
      <thead>
        <tr>
          {props.tableConfig?.multipleSelectable || props.tableConfig?.radioSelectable ? <th /> : null}
          {props.tableConfig?.headerFormat && Object.keys(props.tableConfig?.headerFormat).length ?
            Object.keys(props.tableConfig?.headerFormat).map((header, index) => {
              return visibleColumns?.indexOf(
                props.tableConfig?.headerFormat[header]?.head
              ) > -1 ? <th key={`table-head-${index}`} className={`table-head table-head-${index}`}>
                {props.tableConfig?.headerFormat[header].head}
                {props.tableConfig?.headerFormat[header].sort ?
                  props.tableConfig?.headerFormat[header].option?.map((opt, ind1) => {
                    return !opt.isActive ?
                      opt.type === "DESC" ? <img
                        src={sortDownImage}
                        alt={`descending-order-${props.tableConfig?.headerFormat[header].head}`}
                        key={`descending-order-${ind1}`}
                        className="sort-down"
                        onClick={() => sort(header, 'DESC')}
                      /> : <img
                        src={sortUpImage}
                        alt={`ascending-order-${props.tableConfig?.headerFormat[header].head}`}
                        key={`ascending-order-${ind1}`}
                        className="sort-up"
                        onClick={() => sort(header, 'ASC')}
                      />
                      : null
                  }) : null}
              </th> : null
            })
            : null}
        </tr>
        {props.tableConfig?.filter ?
          <tr>
            {props.tableConfig?.multipleSelectable ? <th>
              <Form.Check
                type="checkbox"
                id={`select-all-row`}
                checked={props.tableData?.every(each => each.selected)}
                onChange={selectUnselectAllRow}
              />
            </th> : null}
            {props.tableConfig?.radioSelectable ? <th /> : null}
            {props.tableConfig?.headerFormat && Object.keys(props.tableConfig?.headerFormat).length ?
              Object.keys(props.tableConfig?.headerFormat).map((header, index) => {
                return visibleColumns?.indexOf(
                  props.tableConfig?.headerFormat[header]?.head
                ) > -1 ? <th key={`table-head-${index}`} className={`table-head table-head-${index}`}>
                  {props.tableConfig?.headerFormat[header].filterObject && Object.keys(props.tableConfig?.headerFormat[header].filterObject).length ?
                    props.tableConfig?.headerFormat[header].filterObject?.type === "TEXT" ?
                      <Form.Control
                        type="text"
                        placeholder={props.tableConfig?.headerFormat[header].filterObject?.placeholder || ''}
                        value={props.tableConfig?.headerFormat[header].filterObject?.value}
                        onChange={(e) => filterByText(e.target.value, header)}
                      />
                      : props.tableConfig?.headerFormat[header].filterObject?.type === "SELECT" ?
                        <Form.Select aria-label="Default select example"
                          value={props.tableConfig?.headerFormat[header].filterObject?.selectedItem?.key}
                          onChange={(e) => filterBySelection(e.target.value, header)}
                        >
                          {props.tableConfig?.headerFormat[header].filterObject?.list?.map(item => {
                            return <option key={item.key} value={item.key}>{item.value}</option>
                          })}
                        </Form.Select> :
                        props.tableConfig?.headerFormat[header].filterObject?.type === "DATE" ?
                          <DatePicker
                            selected={props.tableConfig?.headerFormat[header].filterObject?.value}
                            onChange={date => setDateFilter(date, header)}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            isClearable
                            placeholderText={props.tableConfig?.headerFormat[header].filterObject?.placeholder || ''}
                            dateFormat={props.tableConfig?.headerFormat[header].filterObject?.dateFormat || 'dd/MM/yyyy'}
                          />
                          : null
                    : null}
                </th> : null
              })
              : null}
          </tr> : null}
      </thead>
      <tbody>
        {displayTableData()}
      </tbody>
    </Table> : null
  };

  // function to display the pagination
  const displayPagination = () => {
    if (props.tableConfig?.pagination && props.tableData?.length && visibleColumns?.length) {
      return <ReactPaginate
        previousLabel="<"
        nextLabel=">"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        pageCount={props.tableConfig?.allData ? Math.ceil(allData?.length / props.tableConfig?.limit) : Math.ceil(props.tableData?.length / props.tableConfig?.limit)}
        onPageChange={handlePageClick}
        containerClassName={`pagination ${props.tableConfig?.paginationPosition?.includes("left") ? 'float-left' : 'float-right'}`}
        activeClassName="active"
        forcePage={currentPage - 1}
      />
    } else {
      return null;
    }
  };

  // function to display the full view of the component
  const displayFullView = () => {
    let fullView = null;
    if (props.tableConfig?.columnSelectorPosition?.includes("bottom")) {
      if (props.tableConfig?.paginationPosition?.includes("bottom")) {
        fullView = <>
          {displayTable()}
          {displayColumnSelector()}
          {displayPagination()}
        </>;
      } else {
        fullView = <>
          {displayPagination()}
          {displayTable()}
          {displayColumnSelector()}
        </>
      }
    } else {
      if (props.tableConfig?.paginationPosition?.includes("bottom")) {
        fullView = <>
          {displayColumnSelector()}
          {displayTable()}
          {displayPagination()}
        </>
      } else {
        fullView = <>
          {displayColumnSelector()}
          {displayPagination()}
          {displayTable()}
        </>
      }

      return fullView;
    }
  };

  // updating visible columns array of the component from the parent data
  useEffect(() => {
    if (props.tableConfig?.visibleColumns?.length) {
      updateVisibleColumns([...props.tableConfig?.visibleColumns]);
    }

  }, [props.tableConfig?.visibleColumns]);

  // if the current page changed then handle all selection or all table data
  useEffect(() => {
    toggleAllRowSelection(props.tableData?.every(each => each.selected));
    if (props.tableConfig?.allData) {
      changeTableData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // detect when forced table refresh is needed
  useEffect(() => {
    if (detectDataUpdate) {
      changeTableData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detectDataUpdate]);

  // updating current page number from the parent current page value
  useEffect(() => {
    if (props.paginationCurrentPage) {
      updateCurrentPage(props.paginationCurrentPage);
    }
  }, [props.paginationCurrentPage]);

  // if the table is populated with all data (local pagination and filtering) then update the component with all data
  useEffect(() => {
    if (props.tableConfig?.allData) {
      updateAllData([...props.allData]);
    }
    window.onclick = (ev) => {
      if (!((ev.target.className?.includes('form-check-input') && ev.target.id.includes("column-checkbox")) ||
        (ev.target.className?.includes('form-check-label') && ev.target.htmlFor.includes("column-checkbox")) ||
        ev.target.className.includes('column-selector-dropdown'))) {
        toggleColumnDropdown(false);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="custom-dynamic-table-wrapper">
      {displayFullView()}
    </div>
  );
}

export default CustomDynamicTable;
