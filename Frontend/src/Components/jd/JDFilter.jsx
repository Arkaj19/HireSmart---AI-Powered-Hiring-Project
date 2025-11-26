function JDFilter({ 
  departments = [], 
  experienceBands = [], 
  deptFilter, 
  expFilter, 
  setDeptFilter, 
  setExpFilter 
}) {
  return (
    <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      
      {/* Department Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Practise
        </label>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm min-w-[180px]"
        >
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Experience Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Experience Range
        </label>
        <select
          value={expFilter}
          onChange={(e) => setExpFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm min-w-[180px]"
        >
          <option value="">All ranges</option>
          {experienceBands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      
    </div>
  );
}

export default JDFilter;
