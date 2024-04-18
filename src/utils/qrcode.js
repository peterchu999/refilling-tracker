import QRCode from 'qrcode'
import { jsPDF } from 'jspdf'

const convertRefillDataToHtml = ({ owner, agent, netto, refilling_date, expire_date }) => {
  return `
  <p><b>Owner: ${owner} </b></p>
  <p><b>Agent: ${agent} </b></p>
  <p><b>Netto: ${netto} Kg</b></p>
  <p><b>Refilling Date: ${refilling_date} </b></p>
  <p><b>Expire Date: ${expire_date} </b></p>
  `
}

const generateQRCodeUrl = async (string) => {
  return QRCode.toDataURL(string)
}

export const printQRToPdfFile = async (data) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait'
    })

    const imageData = await Promise.all(
      data.map(async (datum) => {
        const qr = await generateQRCodeUrl(convertRefillDataToHtml(datum))
        return {
          qr,
          title: `ID: ${datum.id}`
        }
      })
    )

    const qrWidth = 60 // Adjust this value as needed
    const qrHeight = 60 // Adjust this value as needed

    const totalOneLineWidth = qrWidth * 3
    const spacing = (doc.internal.pageSize.width - totalOneLineWidth) / 4

    // row start from 0 the same with index
    let currentRow = 0

    for (var i = 1; i <= imageData.length; i++) {
      const { qr, title } = imageData[i - 1]
      
      const rowVerticalCoordinate = (qrHeight + 10) * currentRow
      const xCoor = spacing * ((i % 3) + 1) + qrWidth * (i % 3)
      const yCoor = 10 + rowVerticalCoordinate

      doc.addImage(qr, 'PNG', xCoor, yCoor, qrWidth, qrHeight)

      const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize()

      const titleXCoor = spacing * ((i % 3) + 3) + qrWidth * (i % 3) + (qrWidth - titleWidth) / 2
      const titleYCoor = qrHeight + 15 + rowVerticalCoordinate
      // Add title
      doc.text(titleXCoor, titleYCoor, title, { align: 'center' })

      const is3rdItemOnRow = i % 3 == 0
      if (is3rdItemOnRow) {
        currentRow += 1
        const isFourthRow = currentRow > 3
        if (isFourthRow) {
          doc.addPage()
          currentRow = 0
        }
      }
    }

    return doc.save('qrcode.pdf', {returnPromise: true})
  } catch (err) {
    console.log(err)
  }
}
