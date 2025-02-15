//ProposalPDF.tsx
"use client";
import React, { useState } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import type { ProposalPDFProps, AircraftDetails, AircraftOption } from '@/types/proposal';
import { generateStaticMapURL } from '@/utils/mapGenerator';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    width: 595.28,
  },
  header: {
    marginBottom: 30,
  },
  headerText: {
    fontSize: 24,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    color: '#4a4a4a',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#1a1a1a',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: 1,
    borderBottomColor: '#e0e0e0',
  },
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderBottom: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    fontSize: 10,
    color: '#4a4a4a',
    padding: '0 4px',
  },
  tableCellHeader: {
    fontSize: 10,
    color: '#1a1a1a',
    fontWeight: 'bold',
    padding: '0 4px',
  },
  tableCellWide: {
    width: '30%',
  },
  tableCellMedium: {
    width: '20%',
  },
  tableCellNarrow: {
    width: '10%',
  },
  notesSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  mapContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  map: {
    width: 500,
    height: 300,
    objectFit: 'contain',
  },
  sectionDivider: {
    marginVertical: 30,
    borderTop: 1,
    borderTopColor: '#e0e0e0',
  },
  optionContainer: {
    marginBottom: 40,
  },
  optionColumns: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  optionLeftColumn: {
    width: '60%',
    paddingRight: 20,
  },
  optionRightColumn: {
    width: '60%',
    paddingLeft: 80,
    paddingTop: 28,
  },
  optionNumber: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  aircraftModel: {
    fontSize: 20,
    color: '#1a1a1a',
    marginBottom: 4,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: 'bold',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  noteLabel: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  noteValue: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  detailsTitle: {
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 12,
    color: '#4a4a4a',
    marginBottom: 4,
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
  },
  aircraftImage: {
    width: '48%',
    height: 200,
    objectFit: 'contain',
  },
  optionDivider: {
    marginVertical: 40,
    borderTop: 1,
    borderTopColor: '#e0e0e0',
  },
  disclaimer: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: 1,
    borderTopColor: '#e0e0e0',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#4a4a4a',
    lineHeight: 1.4,
  },
  disclaimerBold: {
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: 1,
    borderTopColor: '#e0e0e0',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 8,
  },
});

const ProposalPDF: React.FC<ProposalPDFProps> = (props) => {
  const [generationDate] = useState(() => {
    const d = new Date();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
  });

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
    } catch (error) {
      return dateStr;
    }
  };

  const getOptionData = (optionNumber: number): AircraftOption => {
    const baseName = `option${optionNumber}`;
    return {
      name: props[`${baseName}Name` as keyof ProposalPDFProps] as string,
      image1: props[`${baseName}Image1` as keyof ProposalPDFProps] as string | null,
      image2: props[`${baseName}Image2` as keyof ProposalPDFProps] as string | null,
      details: props[`${baseName}Details` as keyof ProposalPDFProps] as AircraftDetails | null,
      yearOfManufacture: props[`${baseName}YearOfManufacture` as keyof ProposalPDFProps] as string | null,
      yearRefurbishment: props[`${baseName}YearRefurbishment` as keyof ProposalPDFProps] as string | null,
      price: props[`${baseName}Price` as keyof ProposalPDFProps] as string | null,
      paxCapacity: props[`${baseName}PaxCapacity` as keyof ProposalPDFProps] as string | null,
      notes: props[`${baseName}Notes` as keyof ProposalPDFProps] as string | null,
    };
  };

  const mapUrl = generateStaticMapURL(props.flightLegs);

  const getValidOptions = () => {
    return Array.from({ length: 5 }, (_, i) => i + 1)
      .map(num => ({
        number: num,
        data: getOptionData(num)
      }))
      .filter(option => option.data.name);
  };

  return (
    <Document>
      <Page size={[595.28, 'auto']} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Charter Offer</Text>
          {props.customerName && (
            <Text style={styles.customerName}>Prepared for: {props.customerName}</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Itinerary</Text>
        
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, styles.tableCellWide]}>From</Text>
            <Text style={[styles.tableCellHeader, styles.tableCellWide]}>To</Text>
            <Text style={[styles.tableCellHeader, styles.tableCellMedium]}>Departure (local)</Text>
            <Text style={[styles.tableCellHeader, styles.tableCellNarrow]}>Time</Text>
            <Text style={[styles.tableCellHeader, styles.tableCellNarrow]}>Pax</Text>
          </View>
          
          {props.flightLegs.map((leg) => (
            <View key={leg.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellWide]}>
                {leg.airportDetails.departure || leg.departureAirport || 'N/A'}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellWide]}>
                {leg.airportDetails.arrival || leg.arrivalAirport || 'N/A'}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellMedium]}>{formatDate(leg.departureDate)}</Text>
              <Text style={[styles.tableCell, styles.tableCellNarrow]}>{leg.departureTime || 'N/A'}</Text>
              <Text style={[styles.tableCell, styles.tableCellNarrow]}>{leg.passengerCount || 'N/A'}</Text>
            </View>
          ))}
        </View>

        {props.comment && (
          <View style={styles.notesSection}>
            <Text style={{ fontSize: 12 }}>
              <Text style={{ color: '#1a1a1a', fontWeight: 'bold' }}>Notes: </Text>
              <Text style={{ color: '#1a1a1a' }}>{props.comment}</Text>
            </Text>
          </View>
        )}

        <View style={styles.mapContainer}>
          <Image src={mapUrl} style={styles.map} />
        </View>

        <View style={styles.sectionDivider} />

        {getValidOptions().map((option, index) => (
          <React.Fragment key={option.number}>
            {index > 0 && <View style={styles.optionDivider} />}
            <View style={styles.optionContainer}>
            <View style={styles.optionColumns}>
  <View style={styles.optionLeftColumn}>
    <Text style={styles.optionNumber}>Option {option.number}</Text>
    <Text style={styles.aircraftModel}>{option.data.name}</Text>
    {option.data.price && (
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Price:</Text>
        <Text style={styles.priceValue}>{option.data.price}</Text>
      </View>
    )}
    {option.data.notes && (
      <View style={styles.noteContainer}>
        <Text style={styles.noteLabel}>Notes:</Text>
        <Text style={styles.noteValue}>{option.data.notes}</Text>
      </View>
    )}
  </View>

  <View style={styles.optionRightColumn}>
    <Text style={styles.detailsTitle}>Aircraft Details:</Text>
    {option.data.yearOfManufacture && (
      <Text style={styles.detailsText}>
        Year of Manufacture: {option.data.yearOfManufacture}
      </Text>
    )}
    {option.data.yearRefurbishment && (
      <Text style={styles.detailsText}>
        Year of Refurbishment: {option.data.yearRefurbishment}
      </Text>
    )}
    {option.data.details?.passengerCapacity && (
      <Text style={styles.detailsText}>
        Passenger Capacity: {option.data.details.passengerCapacity}
      </Text>
    )}
    {option.data.details?.cabinHeight && (
      <Text style={styles.detailsText}>
        Cabin Height: {option.data.details.cabinHeight}
      </Text>
    )}
    {option.data.details?.cabinWidth && (
      <Text style={styles.detailsText}>
        Cabin Width: {option.data.details.cabinWidth}
      </Text>
    )}
    
{/* Disabled temporarily
{option.data.details?.baggageVolume && (
  <Text style={styles.detailsText}>
    Baggage Volume: {option.data.details.baggageVolume}
  </Text>
)}
*/}
  </View>
</View>

              <View style={styles.imagesContainer}>
                {option.data.image1 && (
                  <Image
                    src={option.data.image1.startsWith('data:image') ? option.data.image1 : `data:image/jpeg;base64,${option.data.image1}`}
                    style={styles.aircraftImage}
                  />
                )}
                {option.data.image2 && (
                  <Image
                    src={option.data.image2.startsWith('data:image') ? option.data.image2 : `data:image/jpeg;base64,${option.data.image2}`}
                    style={styles.aircraftImage}
                  />
                )}
              </View>
            </View>
          </React.Fragment>
        ))}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.disclaimerBold}>Please note: </Text>
            All options are subject to final availability at the time of booking, flight permits, slots, and owner's approval where applicable.{'\n'}
            Possible de-Icing, WI-FI and other costs are not included and will be Invoiced, if occurred, after the flight
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>Private Jet Charter Proposal • {generationDate}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ProposalPDF;