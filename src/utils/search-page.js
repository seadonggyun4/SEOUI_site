export const setSearchBox = ({
  searchBox,
  label,
  data,
  selected,
  th,
  columnsId,
  event
}) => {
  searchBox.label = label
  searchBox.buildDataMap(data, selected, columnsId ?? null)
  searchBox.show(th)
}