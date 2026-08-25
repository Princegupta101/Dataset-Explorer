const CATEGORY_METADATA = {
  Demographics: {
    domain: 'Population dynamics, demographic distribution, and household composition.',
    stakeholders: 'Urban planners, demographic researchers, and policy analysts.',
    sampleQuestions: (name, year, geo) => [
      `How have patterns in ${name.toLowerCase()} shifted across regions in ${year}?`,
      `What are the regional variations at the ${geo.toLowerCase()} level?`,
    ],
  },
  Healthcare: {
    domain: 'Public health metrics, healthcare infrastructure, and chronic disease prevalence.',
    stakeholders: 'Healthcare providers, public health officials, and medical researchers.',
    sampleQuestions: (name, year, geo) => [
      `Which regions show the highest health risks according to ${name.toLowerCase()}?`,
      `How do these health metrics correlate with access to local facilities?`,
    ],
  },
  Education: {
    domain: 'Academic achievement, graduation milestones, and educational equity.',
    stakeholders: 'School districts, educators, and education policy makers.',
    sampleQuestions: (name, year, geo) => [
      `What performance trends emerge from ${name.toLowerCase()} in ${year}?`,
      `How do outcomes vary across different student demographics?`,
    ],
  },
  Housing: {
    domain: 'Housing markets, affordability indices, and construction trends.',
    stakeholders: 'Housing authorities, real estate analysts, and municipal planners.',
    sampleQuestions: (name, year, geo) => [
      `How do housing affordability metrics compare across ${geo.toLowerCase()} markets?`,
      `What are the historical trends in housing supply and rent levels?`,
    ],
  },
  Economics: {
    domain: 'Economic output, employment rates, and inflation indicators.',
    stakeholders: 'Economists, financial analysts, and corporate strategy teams.',
    sampleQuestions: (name, year, geo) => [
      `What economic sectors drive the most significant changes in ${year}?`,
      `How do localized wage metrics compare to national averages?`,
    ],
  },
};

export function generateDatasetSummary(dataset) {
  const { name, category, source, geography, year, tags = [], sampleAttributes = [], recordsCount = 0 } = dataset;
  const meta = CATEGORY_METADATA[category] || {
    domain: 'General statistical intelligence.',
    stakeholders: 'Data analysts and researchers.',
    sampleQuestions: () => [`What insights can be drawn from ${name}?`],
  };

  const executiveSummary = `${name} is a ${category.toLowerCase()} dataset published by ${source} for ${year}. It covers observations at the ${geography.toLowerCase()} level, encompassing ${recordsCount.toLocaleString()} records across attributes like ${sampleAttributes.slice(0, 4).join(', ') || 'standard metrics'}.`;

  const keyTakeaways = [
    `Geographic scope: ${geography} resolution.`,
    `Source: Published by ${source}.`,
    `Reporting year: ${year}.`,
    ...(tags.length ? [`Key topics: ${tags.join(', ')}.`] : []),
  ];

  return {
    datasetId: dataset._id,
    datasetName: name,
    category,
    year,
    generatedAt: new Date().toISOString(),
    executiveSummary,
    domainAnalysis: meta.domain,
    targetStakeholders: meta.stakeholders,
    keyTakeaways,
    suggestedAnalyticalQuestions: meta.sampleQuestions(name, year, geography),
  };
}

export default { generateDatasetSummary };
