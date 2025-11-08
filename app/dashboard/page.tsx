import { generateInitialDataset } from '@/lib/dataGenerator';
import { WithData } from '@/components/providers/DataProvider';
import DashboardBody from '@/components/ui/DashboardBody';

export default async function DashboardPage(){
  const initial = generateInitialDataset(12000);
  return (
    <WithData initial={initial}>
      <main className="container">
        <DashboardBody />
      </main>
    </WithData>
  );
}
