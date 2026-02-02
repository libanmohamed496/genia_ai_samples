import type { CarsData } from '../types';
import './AllDataView.css';

interface AllDataViewProps {
  data: CarsData;
}

export function AllDataView({ data }: AllDataViewProps) {
  const allVehicles = data.brands.flatMap((brand) =>
    brand.vehicles.map((vehicle) => ({
      ...vehicle,
      brand: brand.name,
      country: brand.country,
    }))
  );

  return (
    <div className="all-data-view">
      <h2>All Vehicles</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Model</th>
              <th>Year</th>
              <th>Type</th>
              <th>Price</th>
              <th>HP</th>
              <th>MPG</th>
            </tr>
          </thead>
          <tbody>
            {allVehicles.map((vehicle, index) => (
              <tr key={`${vehicle.brand}-${vehicle.model}-${index}`}>
                <td>{vehicle.brand}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.year}</td>
                <td>{vehicle.type}</td>
                <td>${vehicle.price.toLocaleString()}</td>
                <td>{vehicle.horsepower}</td>
                <td>{vehicle.mpg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
