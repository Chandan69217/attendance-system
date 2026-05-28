import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import html2canvas from "html2canvas"

interface ExportPdfOptions<T> {
  title: string
  fileName?: string
  charts?: React.RefObject<HTMLElement|null>[]
  tableHeaders: string[]
  tableData: T[]
  mapRow: (row: T) => (string | number | null | undefined)[]
}

export const exportToPdf = async <T>({
  title,
  fileName = "report.pdf",
  charts = [],
  tableHeaders,
  tableData,
  mapRow,
}: ExportPdfOptions<T>) => {

  const doc = new jsPDF("p", "mm", "a4")

  doc.setFontSize(16)
  doc.text(title, 14, 15)

  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toISOString().split("T")[0]}`, 14, 22)

  let yPosition = 30


  for (const chartRef of charts) {
    if (chartRef?.current) {
      const canvas = await html2canvas(chartRef.current)
      const imgData = canvas.toDataURL("image/png")

      if (yPosition + 70 > 280) {
        doc.addPage()
        yPosition = 20
      }

      doc.addImage(imgData, "PNG", 10, yPosition, 190, 60)
      yPosition += 70
    }
  }

  const safeBody = tableData.map((row) =>
    mapRow(row).map((cell) =>
      cell === null || cell === undefined ? "-" : String(cell)
    )
  )

  autoTable(doc, {
    startY: yPosition,
    head: [tableHeaders],
    body: safeBody,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  })

  doc.save(fileName)
}