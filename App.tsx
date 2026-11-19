import {useState} from 'react';
import {AccessionModal} from './components/AccessionModal';
import {ExhibitionsSection} from './components/ExhibitionsSection';
import {FieldNotesSection} from './components/FieldNotesSection';
import {Footer} from './components/Footer';
import {HeroSection} from './components/HeroSection';
import {Navbar} from './components/Navbar';
import {ReservationModal} from './components/ReservationModal';
import {SanctuariesSection} from './components/SanctuariesSection';
import {EXHIBITIONS, ExhibitionPlate, SHELTERS, ShelterSpec} from './data/sanctuaryData';
import {
  loadSavedPasses,
  removePassFromStorage,
  ReservationPass,
  savePassToStorage,
} from './utils/formatters';

export default function App() {
  const [selectedPlate, setSelectedPlate] = useState<ExhibitionPlate | null>(null);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [reservationTab, setReservationTab] = useState<'reserve' | 'passes'>('reserve');
  const [preselectedShelterId, setPreselectedShelterId] = useState<string>(SHELTERS[0].id);
  const [savedPasses, setSavedPasses] = useState<ReservationPass[]>(() => loadSavedPasses());

  const handleOpenReservation = (shelterId?: string) => {
    if (shelterId) {
      setPreselectedShelterId(shelterId);
    }
    setReservationTab('reserve');
    setReservationOpen(true);
  };

  const handleOpenPasses = () => {
    setReservationTab('passes');
    setReservationOpen(true);
  };

  const handleReserveFromPlate = (plate: ExhibitionPlate) => {
    setSelectedPlate(null);
    const matchingShelter =
      plate.biome === 'Glacial Caverns'
        ? SHELTERS[1].id
        : plate.biome === 'Boreal Tarns'
          ? SHELTERS[2].id
          : SHELTERS[0].id;
    handleOpenReservation(matchingShelter);
  };

  const handleReserveFromShelter = (shelter: ShelterSpec) => {
    handleOpenReservation(shelter.id);
  };

  const handleCreatePass = (pass: ReservationPass) => {
    const updated = savePassToStorage(pass);
    setSavedPasses(updated);
  };

  const handleRemovePass = (id: string) => {
    const updated = removePassFromStorage(id);
    setSavedPasses(updated);
  };

  const scrollToExhibitions = () => {
    document.getElementById('exhibitions')?.scrollIntoView({behavior: 'smooth'});
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-[#e0e2ed] abyssal-grain">
      <Navbar
        onOpenReservation={() => handleOpenReservation()}
        onOpenPasses={handleOpenPasses}
        savedPassCount={savedPasses.length}
      />

      <main>
        <HeroSection
          onExploreExhibitions={scrollToExhibitions}
          onInspectPlate={() => setSelectedPlate(EXHIBITIONS[0])}
        />

        <ExhibitionsSection onSelectPlate={setSelectedPlate} />

        <SanctuariesSection onReserveShelter={handleReserveFromShelter} />

        <FieldNotesSection />
      </main>

      <Footer onOpenReservation={() => handleOpenReservation()} />

      <AccessionModal
        plate={selectedPlate}
        plates={EXHIBITIONS}
        onClose={() => setSelectedPlate(null)}
        onSelectPlate={setSelectedPlate}
        onReserveSector={handleReserveFromPlate}
      />

      <ReservationModal
        isOpen={reservationOpen}
        initialTab={reservationTab}
        preselectedShelterId={preselectedShelterId}
        savedPasses={savedPasses}
        onClose={() => setReservationOpen(false)}
        onCreatePass={handleCreatePass}
        onRemovePass={handleRemovePass}
      />
    </div>
  );
}
