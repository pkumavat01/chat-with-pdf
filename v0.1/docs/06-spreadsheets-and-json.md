# Spreadsheets and JSON

> Source: https://www.aem.live/developer/spreadsheets

In addition to converting Google Docs and Word documents into markdown and HTML, Adobe Experience Manager (AEM) translates spreadsheets — including Microsoft Excel workbooks and Google Sheets — into JSON files that can easily be consumed by your website or web application.

## Sheet Structure Basics

The simplest spreadsheet format uses the first row for column headers, with subsequent rows containing data. Once published via the Sidekick, AEM converts this table into a JSON representation served at the corresponding `.json` resource endpoint.

The conversion produces structured data with properties including:

- `total`: row count
- `offset`: starting position
- `limit`: maximum rows returned
- `columns`: header names
- `data`: array of row objects
- `:type`: identifies it as a sheet

## Multiple Sheets

AEM manages workbooks with different sheet-handling rules:

- **Single sheet workbooks**: The sole sheet becomes the default source
- **Multiple sheets**: Only sheets prefixed with `shared-` are exposed; others remain hidden
- **`shared-default` sheet**: Delivered as a single sheet unless a query parameter specifies otherwise
- **Multiple `shared-` prefixed sheets**: Returned in multi-sheet format

The deprecated `helix-` prefix has been replaced with the `shared-` prefix.

## Multi-Sheet Format

When multiple `shared-` prefixed sheets exist, AEM returns a payload containing:

- `:names`: array listing all sheet names
- `:type`: set to "multi-sheet"
- Individual properties for each sheet with its corresponding data

## Query Parameters

**Offset and Limit**: Control which rows are returned from large spreadsheets. By default, AEM returns up to 1000 rows if no limit is specified.

**Sheet**: The `sheet` parameter selects specific sheets — for example, `?sheet=jobs` returns `shared-jobs`.

## Special Considerations

Arrays as cell values are delivered as strings and can be converted back to arrays using JavaScript's `JSON.parse()` method. The indexing service writes exclusively to a sheet named `raw_index`.
