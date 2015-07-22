
var MOCK_CONFIG = {
  columns: [
    {
      css: {
        header: ['header-0'],
        cell: ['col-0']
      },
      field: 'name',
      title: 'Name'
    },
    {
      css: {
        header: ['header-2'],
        cell: ['col-2']
      },
      field: 'telephone',
      isSortable: true,
      title: 'Phone'
    },
    {
      css: {
        header: ['header-3'],
        cell: ['col-3']
      },
      field: 'zip',
      title: 'Zip'
    }
  ]
};

var MOCK_CONFIG_GROUPED_HEADER = {
  columns: [
    {
      css: {
        header: ['header-0'],
        cell: ['col-0']
      },
      field: 'id',
      title: 'Id'
    },
    {
      css: {
        header: ['header-1'],
        cell: ['col-1']
      },
      field: 'name',
      title: 'Name'
    },
    {
      css: {
        header: ['header-2'],
        cell: ['col-2']
      },
      title: 'Personal Info',
      columns: [
        {
          css: {
            header: ['header-3'],
            cell: ['col-3']
          },
          field: 'telephone',
          isSortable: true,
          title: 'Phone'
        },
        {
          css: {
            header: ['header-4'],
            cell: ['col-4']
          },
          field: 'zip',
          title: 'Zip'
        }]
    }]
};