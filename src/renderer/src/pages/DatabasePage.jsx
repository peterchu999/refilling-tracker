import { createQuery } from '@tanstack/solid-query'
import {
  createSolidTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel
} from '@tanstack/solid-table'
import { Container, Table as BTable, Badge, Pagination, Button, Col } from 'solid-bootstrap'
import { For, Match, Switch, createEffect, createSignal } from 'solid-js'
import { printQRToPdfFile } from '../../../utils/qrcode'

const today = new Date()

const columns = [
  {
    cell: (info) => {
      return (
        <input
          type="checkbox"
          checked={info.row.getIsSelected()}
          onChange={(e) => info.row.toggleSelected(e.target.checked)}
        />
      )
    },
    header: 'select'
  },
  {
    accessorKey: 'id',
    cell: (info) => info.getValue(),
    header: () => 'ID'
  },
  {
    accessorKey: 'owner',
    cell: (info) => info.getValue(),
    header: () => 'Owner'
  },
  {
    accessorKey: 'agent',
    cell: (info) => info.getValue(),
    header: () => 'Agent'
  },
  {
    accessorKey: 'netto',
    cell: (info) => `${info.getValue()} kg`,
    header: () => 'Netto'
  },
  {
    accessorKey: 'refilling_date',
    cell: (info) => info.getValue(),
    header: () => 'Refilling Date'
  },
  {
    accessorKey: 'expire_date',
    cell: (info) => info.getValue(),
    header: () => 'Expire Date'
  },
  {
    accessorKey: 'is_qr_printed',
    cell: (info) => {
      if (!info.getValue()) {
        return (
          <Badge bg="warning" text="dark">
            not printed
          </Badge>
        )
      }
      return <Badge bg="primary">printed</Badge>
    },
    header: () => 'Is QR Printed'
  },
  {
    accessorKey: 'expire_date',
    cell: (info) => {
      const expire_date = new Date(info.getValue())
      if (today > expire_date) {
        return <Badge bg="danger">Expire</Badge>
      }
      return <Badge bg="success">-</Badge>
    },
    header: () => 'Is Expired'
  }
]

function DatabasePage() {
  const [selectedCount, setSelectedCount] = createSignal(0)

  const state = createQuery(() => ({
    queryKey: ['extinguisher'],
    queryFn: async () => {
      try {
        const result = window.sqlite.refillDataDB?.fetchData()
        return result
      } catch (error) {
        throw error
      }
    }
  }))

  const table = createSolidTable({
    get data() {
      return state.data ?? []
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableMultiRowSelection: true
  })

  window.api.onClearPrintQRSelection((value) => {
    table.resetRowSelection(value)
  })

  createEffect(() => {
    const { rows } = table.getSelectedRowModel()
    setSelectedCount(rows.length)
  })

  const resetTableSelection = () => {
    table.resetRowSelection(true)
  }

  const printQR = async () => {
    const data = table.getSelectedRowModel().rows.map(({ original }) => original)
    const state = printQRToPdfFile(data)
    console.log(state)
    state.then((data) => {
      console.log("called after save", data)
    })
    // console.log("Called after save")
  }

  return (
    <Container fluid>
      <h2>List Of Refilling</h2>
      <Container>
        <Col>
          <Button onClick={resetTableSelection}>Reset Selection</Button>
        </Col>
        <Col>
          Selected Row:
          {selectedCount()}
          <Button onClick={printQR}>Print QR</Button>
        </Col>
      </Container>
      <Switch>
        <Match when={state.isLoading}></Match>
        <Match when={state.data != undefined}>
          <BTable striped bordered hover responsive size="sm">
            <thead>
              <For each={table.getHeaderGroups()}>
                {(headerGroup) => (
                  <tr>
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <th colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </thead>
            <tbody>
              <For each={table.getRowModel().rows}>
                {(row) => (
                  <tr>
                    <For each={row.getVisibleCells()}>
                      {(cell) => {
                        return <td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      }}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </BTable>
          <Switch>
            <Match when={table.getPageCount() > 1}>
              <Pagination class="d-flex justify-content-center">
                <Switch>
                  <Match when={table.getCanPreviousPage()}>
                    <Pagination.Prev onClick={table.previousPage} />
                    <Pagination.Item onClick={table.firstPage}>{1}</Pagination.Item>
                    <Pagination.Ellipsis />
                  </Match>
                </Switch>

                <Pagination.Item active>
                  {table.getState().pagination.pageIndex + 1}
                </Pagination.Item>

                <Switch>
                  <Match when={table.getCanNextPage()}>
                    <Pagination.Ellipsis />
                    <Pagination.Item onClick={table.lastPage}>
                      {table.getPageCount()}
                    </Pagination.Item>
                    <Pagination.Next onClick={table.nextPage} />
                  </Match>
                </Switch>
              </Pagination>
            </Match>
          </Switch>
        </Match>
      </Switch>
    </Container>
  )
}

export default DatabasePage
